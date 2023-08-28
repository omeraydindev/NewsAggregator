<?php

namespace App\Tasks\Scraper\Impl;

use App\Tasks\Scraper\BaseScraper;
use Carbon\Carbon;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;

class TheGuardianScraper extends BaseScraper
{
    protected array $apiKeys = [
        'THEGUARDIAN_KEY3',
        'THEGUARDIAN_KEY4',
        'THEGUARDIAN_KEY',
        'THEGUARDIAN_KEY2',
    ];

    protected function makeSearchRequest(string $apiKey, array $params): Response
    {
        return Http::get('https://content.guardianapis.com/search', [
            'api-key' => $apiKey,
            ...$params,
        ]);
    }

    public function scrape(): bool
    {
        $currentPage = 1;

        do {
            $response = $this->retryableRequest([
                'from-date' => $this->scrapeMonth->format('Y-m-d'),
                'to-date' => $this->scrapeMonth->copy()->endOfMonth()->format('Y-m-d'),

                // Maksimum 200 haber alabiliyoruz
                'page' => $currentPage++,
                'page-size' => 200,

                // Küçük resim, açıklama, yazar
                'show-fields' => 'thumbnail,trailText,byline',

                // Yazarlar
                'show-tags' => 'contributor',
            ])->json();

            $results = $response['response']['results'];

            foreach ($results as $result) {
                $authors = collect($result['tags'] ?? [])
                    ->map(fn($tag) => $tag['webTitle'])
                    ->toArray();

                $this->saveArticle([
                    'title' => $result['webTitle'],
                    'category' => $result['sectionName'],
                    'origin' => 'The Guardian', // Bu API'da origin yok
                    'published_at' => Carbon::parse($result['webPublicationDate']),
                    'description' => $result['fields']['trailText'] ?? '',
                    'web_url' => $result['webUrl'],
                    'image_url' => $result['fields']['thumbnail'] ?? '',
                    'authors' => $authors,
                ]);
            }

            $respCurrentPage = $response['response']['currentPage'];
            $respPages = $response['response']['pages'];

        } while ($respCurrentPage < $respPages);

        return true;
    }
}
