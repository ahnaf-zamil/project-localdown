import sys
from src.app import make_app, db

app = make_app()


def main():
    args = sys.argv
    if len(args) > 1:
        if args[1] == "migrate":
            from src.models import Novel

            with app.app_context():
                # Enabling triagram extension for fuzzy search with typos
                db.session.execute("CREATE EXTENSION IF NOT EXISTS pg_trgm")
                db.create_all()
        else:
            print(f"Invalid argument: ${args[1]}")
    else:
        app.run(debug=True, port=8000)


if __name__ == "__main__":
    main()
