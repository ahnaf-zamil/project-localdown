# Data API server

This server scrapes LN data from novelupdates.com, compiles it into a CSV, stores it in PostgreSQL and then provides an API to search and fetch LN data.

**By default, this server runs on port 8000**

The key responsibilities of this server is

- Scrape and store LN data into SQL DB
- Provide a simple search engine for searching LNs from DB
- Allow fetching LN info by it's ID

## How to run server

Make sure you have Python installed (3.10 would be best) and PostgreSQL.

Rename `.env.example` to `.env`, and configure the variables

Install dependencies

```
pip install -r requirements.txt
```

If database has not been created, create it by running the migrate command

```
python wsgi.py migrate
```

Now start the server

```
python wsgi.py
```

## How to fetch LN data

For this, you need to run two things: the scraper and loader.

The scraper is responsible for getting data from novelupdates and compiling them into a CSV file. This took me 7 hours approximately. Note that some data in the CSV have duplicates and you have to manually filter them out (Just open it up in MS Word or Libreoffice Calc, and use a duplicate conditional to highlight them). There aren't a lot, so it isn't that time consuming.

The loader takes the data from the CSV file and stores it into PostgreSQL, to be later accessed by the Data API.

### Running scraper

Go to the [data](./data) directory

```
cd ./data
```

Install dependencies

```
pip install -r requirements.txt
```

Now run the scraper

```
python scraper.py
```

**This will output a novels_data.csv file, which will be used by the DB loader late. DONT CHANGE THE FILE NAME OR LOCATION OF IT**

### Running DB loader

Go to the `data-api` directory (not the `data` folder) and make sure you have installed dependencies from the "Running Data API" stage, it requires the same stuff. If you have already done it, no need to do it again.

Make sure your `.env` is set up properly as well.

Just run the loader using

```
python loader.py
```
