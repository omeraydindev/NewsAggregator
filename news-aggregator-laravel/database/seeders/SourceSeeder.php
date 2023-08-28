<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SourceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Öncelik sırasına göre
        DB::table('sources')->insert([
            [
                'name' => 'The Guardian',
                'php_class' => 'App\Tasks\Scraper\Impl\TheGuardianScraper',
            ],
            [
                'name' => 'The New York Times',
                'php_class' => 'App\Tasks\Scraper\Impl\NyTimesScraper',
            ],
            [
                'name' => 'News API',
                'php_class' => 'App\Tasks\Scraper\Impl\NewsApiScraper',
            ],
        ]);
    }
}
