#!/bin/sh

DB=./data.db

source ./venv/bin/activate

if [ ! -f "$DB" ]; then
    echo "Database does not exist, migrating"
    python wsgi.py --migrate
fi
echo "Starting server"
python wsgi.py