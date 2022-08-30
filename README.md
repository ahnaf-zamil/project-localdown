# Project LocalDown

A Plex-like project for accessing locally downloaded Light Novels through a centralised UI. Sources LN data from novelupdates.com

## Structure

| Codebase               |                       Description                        |
| :--------------------- | :------------------------------------------------------: |
| [data-api](data-api)   | Public API for storing LN data sourced from novelupdates |
| [local-api](local-api) | API server that the end-user will run to use the project |
| [web](web)             |             React web client for the project             |

## Contributions

This project is open to contributions, as well as feedback. But I recommend creating an issue for it, or contacting me on Discord to discuss about it. My Discord: Ahnaf#4346

## Idea

I got this idea from a friend of mine from the Tantei Wa Mou, Shindeiru Discord server. His idea was to make something like Plex, but for Light Novels. Users can have their LN PDFs scattered all across their computers, add them to the application, and access them through the centralised UI and read them. Later, I plan on adding mobile support so that users on the same network (or external network with IP) can read LNs on the go.

## LN Data

If you don't want to run the data scraper and create your own dataset like I did, you can use download the CSV file of the LN list from this [link](https://cdn.discordapp.com/attachments/774289170545377290/1013840731984637962/novels_data.csv) (surprisingly, the total size is less than 5 MB). At the moment, this dataset contains 13k+ novel info sourced from novelupdates.com. If you wish to not wait for 7 hours and just get started with it, you can use this data without any hesitation since I doubt Novel information change very frequently. Plus, almost all existing novels have been covered in this dataset.

Save that file as `novels_data.csv` under `data-api/data` directory. Now you can run the DB loader to store this data in a PostgreSQL database (check out the [Data API README](data-api/README.md) to see how you can run it)

**Edit:** I have hosted my own instance of the Data API, which you can find at `https://api.ahnafzamil.com/localdown`

## Credits

I would like to thank these people for helping me with this

- Dominatroy#0731 - For providing me with emotional support and brain damage
