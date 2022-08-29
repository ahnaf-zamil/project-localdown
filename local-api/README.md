# Local API server

This is the server that every user who wants to use this project must host. They can host it on their computers and maybe expose them on their local network. This is the main thing that runs the stuff.

Uses SQLite3 to store libraries and cache novel info.

**By default, this server runs on port 5000**

The key responsibilities of this server is

- Search and provide access to novel list from [Data API](../data-api/)
- To cache LN information
- Create a centralised space for all light novels
- Todo: Make local PDFs accessible to (web or mobile) clients

## How to run

Make sure you have Python installed (3.10 would be best).

Rename `.env.example` to `.env`, and configure the variables

Install dependencies

```
pip install -r requirements.txt
```

If database has not been created, create it by running the migrate command

```
python wsgi.py --migrate
```

Now start the server

```
python wsgi.py
```

**Make sure you have a valid URL for Data API server in your `.env`! If you are hosting it on your PC, point it to it's URL. If you are not hosting the Data API server, point it to a publicly hosted one (will provide one myself soon)**
