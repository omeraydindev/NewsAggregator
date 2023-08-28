<?php

namespace App\Tasks\Scraper;

use App\Models\Article;
use Carbon\Carbon;
use Illuminate\Http\Client\Response;

abstract class BaseScraper
{
    // DB'den dinamik olarak alınıyor
    public int $sourceId;
    public Carbon $scrapeMonth;

    // Alt sınıfların bu değişkeni doldurması gerekiyor
    protected array $apiKeys = [];

    // Eğer bir tane bile haber çekebildiysek checkpoint set edeceğiz
    public bool $scrapedAtLeastOneArticle = false;

    public function __construct(int $sourceId, Carbon $scrapeMonth)
    {
        $this->sourceId = $sourceId;
        $this->scrapeMonth = $scrapeMonth;

        if (empty($this->apiKeys)) {
            throw new \Exception('API key not found');
        }

        $this->apiKeys = collect($this->apiKeys)
            ->map(fn($key) => env($key))
            ->toArray();
    }

    protected abstract function makeSearchRequest(string $apiKey, array $params): Response;

    /**
     * @throws RateLimitException
     */
    public abstract function scrape(): bool;

    /**
     * @throws RateLimitException
     */
    protected function retryableRequest(array $params): Response
    {
        for ($retryCount = 0; $retryCount < 3; $retryCount++) {
            foreach ($this->apiKeys as $apiKey) {
                $response = $this->makeSearchRequest($apiKey, $params);

                if ($response->successful()) {
                    return $response;
                }
            }

            // Requestler arası 10, 15, 20 sn şeklinde artarak bekle
            sleep(($retryCount * 5) + 10);
        }

        throw new RateLimitException();
    }

    protected function saveArticle(array $params): void
    {
        $this->scrapedAtLeastOneArticle = true;

        $article = Article::query()->create([
            'source_id' => $this->sourceId,
            'title' => $params['title'] ?? '',
            'category' => $params['category'] ?? '',
            'origin' => $params['origin'] ?? '',
            'published_at' => $params['published_at'] ?? Carbon::now(),
            'description' => $params['description'] ?? '',
            'web_url' => $params['web_url'] ?? '',
            'image_url' => $params['image_url'] ?? '',
        ]);

        $authors = collect($params['authors'])
            ->map(fn($author) => ['name' => $author])
            ->toArray();

        if (!empty($authors)) {
            $article->authors()->createMany($authors);
        }
    }
}
