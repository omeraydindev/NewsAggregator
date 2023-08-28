<?php

namespace App\Tasks\Scraper\Impl;

use App\Tasks\Scraper\BaseScraper;
use Carbon\Carbon;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Http;

class NyTimesScraper extends BaseScraper
{
    protected array $apiKeys = [
        'NYTIMES_KEY',
    ];

    protected function makeSearchRequest(string $apiKey, array $params): Response
    {
        return Http::get('https://api.nytimes.com/svc/search/v2/articlesearch.json', [
            'api-key' => $apiKey,
            ...$params,
        ]);
    }

    public function scrape(): bool
    {
        $currentPage = 0;
        $pageSize = 10;

        do {
            $response = $this->retryableRequest([
                'begin_date' => $this->scrapeMonth->format('Ymd'),
                'end_date' => $this->scrapeMonth->copy()->endOfMonth()->format('Ymd'),

                // Maksimum 10 haber alabiliyoruz
                'page' => $currentPage++,

                // Küçük resim, açıklama, yazar, kategori vs
                'fl' => 'abstract,headline,web_url,lead_paragraph,pub_date,section_name,byline,multimedia',
            ])->json();

            $results = $response['response']['docs'];

            foreach ($results as $result) {
                $title = Arr::get($result, 'headline.main', Arr::get($result, 'abstract', ''));

                $imageUrl = collect($result['multimedia'] ?? [])
                    ->where('type', 'image')
                    ->first()['url'] ?? '';

                if ($imageUrl) $imageUrl = 'https://www.nytimes.com/' . $imageUrl;

                $authors = collect($result['byline']['person'] ?? [])
                    ->map(fn($author) => $author['firstname'] . ' ' . $author['lastname'])
                    ->toArray();

                $this->saveArticle([
                    'title' => $title,
                    'category' => $result['section_name'],
                    'origin' => 'The New York Times', // Bu API'da origin yok
                    'published_at' => Carbon::parse($result['pub_date']),
                    'description' => $result['lead_paragraph'],
                    'web_url' => $result['web_url'],
                    'image_url' => $imageUrl,
                    'authors' => $authors,
                ]);
            }

            $respHits = $response['response']['meta']['hits'];
            $respOffset = $response['response']['meta']['offset'];

            // Her sayfada 1 sn bekle
            sleep(1);

        } while (
            // NyTimes 200. sayfadan sonrasını almaya izin vermiyor (free plan)
            $currentPage <= 200 &&

            // Her sayfada 10 haber var, daha az varsa son sayfaya gelmişizdir
            count($results) === $pageSize &&

            // Toplam haber sayısına ulaşana kadar devam et
            $respOffset + $pageSize < $respHits
        );

        return true;
    }
}
