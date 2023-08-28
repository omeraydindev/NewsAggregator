<?php

namespace App\Console\Commands;

use App\Tasks\PullNewsFromDb;
use Illuminate\Console\Command;

class ManuallyPullNewsFromDb extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:manually-pull-news-from-db';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Manually scrape news from db';

    /**
     * Execute the console command.
     * @throws \Exception
     */
    public function handle()
    {
        (new PullNewsFromDb)();
    }
}
