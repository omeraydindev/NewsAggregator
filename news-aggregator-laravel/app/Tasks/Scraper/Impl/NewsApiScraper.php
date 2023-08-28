<?php

namespace App\Tasks\Scraper\Impl;

use App\Tasks\Scraper\BaseScraper;
use Carbon\Carbon;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Http;

class NewsApiScraper extends BaseScraper
{
    protected array $apiKeys = [
        'NEWSAPI_KEY',
    ];

    protected function makeSearchRequest(string $apiKey, array $params): Response
    {
        return Http::get('https://newsapi.org/v2/top-headlines', [
            'apiKey' => $apiKey,
            ...$params,
        ]);
    }

    public function scrape(): bool
    {
        $categories = [
            'business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'
        ];

        // Her kategori için ayrı ayrı sorgu atıyoruz,
        // çünkü /everything endpointi haberlerin içinde kategorilerini vermiyor
        foreach ($categories as $category) {
            $this->scrapeCategory($category);
        }

        return true;
    }

    private function scrapeCategory(string $category)
    {
        $currentPage = 1;
        $pageSize = 100;

        do {
            $response = $this->retryableRequest([
                'category' => $category,
                'language' => 'en',

                'from' => $this->scrapeMonth->format('Y-m-d'),
                'to' => $this->scrapeMonth->copy()->endOfMonth()->format('Y-m-d'),

                'page' => $currentPage++,
            ])->json();

            $results = $response['articles'];

            foreach ($results as $result) {
                $this->saveArticle([
                    'title' => $result['title'],
                    'category' => $category,
                    'origin' => Arr::get($result, 'source.name', 'News API'),
                    'published_at' => Carbon::parse($result['publishedAt']),
                    'description' => $result['description'],
                    'web_url' => $result['url'],
                    'image_url' => $result['urlToImage'],
                    'authors' => $result['author'] ? [$result['author']] : '',
                ]);
            }
        } while (
            // NewsApi 5. sayfadan sonrasını almaya izin vermiyor (free plan)
            $currentPage <= 5 &&

            // Toplam haber sayısına ulaşana kadar devam et
            $response['totalResults'] > $currentPage * $pageSize
        );
    }
}
