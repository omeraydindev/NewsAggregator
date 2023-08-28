<?php

namespace App\Tasks;

use App\Models\Source;
use App\Models\SourceCheckpoint;
use App\Tasks\Scraper\BaseScraper;
use Carbon\Carbon;

class PullNewsFromDb
{
    public function __invoke(): void
    {
        $sources = Source::query()->get();

        foreach ($sources as $source) {
            // Bu source için en son checkpoint'ı buluyoruz
            $sourceCheckpoint = SourceCheckpoint::query()
                ->where('source_id', '=', $source->id)
                ->orderByDesc('scrape_month')
                ->limit(1)
                ->get()
                ->first();

            // Checkpoint bulamadıysak bu ayın ilk gününden başlıyoruz
            $scrapeMonth = $sourceCheckpoint
                ? Carbon::parse($sourceCheckpoint->scrape_month)->subMonth()
                : now()->startOfMonth();

            $scraperClass = $source->php_class;
            if (!class_exists($scraperClass)) {
                throw new \Exception('Scraper class not found');
            }

            // Scraper class'ını dinamik olarak oluşturuyoruz
            /* @var $scraper BaseScraper */
            $scraper = new $scraperClass($source->id, $scrapeMonth);

            $success = false;
            try {
                $success = $scraper->scrape();
            } catch (Scraper\RateLimitException) {
                $success = $scraper->scrapedAtLeastOneArticle;
            } finally {
                // İşlem başarılıysa checkpoint set ediyoruz
                if ($success) {
                    SourceCheckpoint::query()->create([
                        'source_id' => $source->id,
                        'scrape_month' => $scrapeMonth,
                    ]);
                }
            }
        }
    }
}
