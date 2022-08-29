"""Loads data from CSV into PostgreSQL"""

from wsgi import make_app, db
from data.utils import progressbar
from src.models import Novel

import csv
import re

with open("data/novels_data.csv", "r") as f:
    app = make_app()
    app.app_context().push()
    reader = csv.reader(f)

    print(f"Starting dataset load into PostgreSQL")
    row_count = 0
    for i, line in enumerate(reader):
        if i > 0:
            authors = ", ".join(
                line[5].strip("[]").replace(" ", "").replace("'", "").split(",")
            )
            genres = ", ".join(
                line[6].strip("[]").replace(" ", "").replace("'", "").split(",")
            )
            start_year = re.sub("[^0-9]", "", line[7]) if line[7] != "" else None
            publisher = line[9] if line[9] != "" else None
            other_names = line[3].strip("[]") if line[3] != "" else None

            new_novel = Novel(
                id=line[0],
                title=line[1],
                cover_url=line[2],
                authors=authors,
                genres=genres,
                start_year=start_year,
                publisher=publisher,
                other_names=other_names,
            )
            db.session.add(new_novel)
            if not i % 50:
                db.session.commit()
                print(f"Committed a total of {i} rows")

            row_count = i
    db.session.commit()
    print("Finished loading data into PostgreSQL")
    print(f"Loaded a total of {row_count} data rows")
