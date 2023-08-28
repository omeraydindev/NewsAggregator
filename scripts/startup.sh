#!/bin/bash

cd /app

composer install

php artisan optimize:clear

/etc/scripts/wait-for-it.sh news-aggregator-db:3306

php artisan migrate --force

php artisan schedule:test --name pull-news-from-db &

php artisan schedule:work &

php artisan serve --host=0.0.0.0 --port=8000
