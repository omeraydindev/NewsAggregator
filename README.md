# News Aggregator

## Setup
We use docker-compose to run the application. To start the application, run the following command in this directory:

```bash
docker-compose up -d
```
This starts containers for the Laravel backend, the React frontend and the MariaDB database. The app will be available at http://localhost:3000 .
The backend is available at http://localhost:8000 .

After the containers are built and they start, it might take 1-2 minutes for the application to be available as the database needs to be filled with data from the scraper.

## Scraper
There is a scraper that runs every 5 minutes to fetch new articles from the news sources.
Check out the code in `App\Tasks\Scraper` in the Laravel backend.

Right now it has 3 API sources:
- [The New York Times](https://developer.nytimes.com/docs/articlesearch-product/1/overview)
- [The Guardian](https://open-platform.theguardian.com/documentation/)
- [News API](https://newsapi.org/)
