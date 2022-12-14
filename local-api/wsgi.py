import argparse
import os
from src.app import make_app, db

app = make_app()
HOST = "*:5000"


def migrate_db():
    print("Migrating DB")
    from src.models import Library, NovelCache

    with app.app_context():
        db.create_all()


def main(args):
    if not os.path.exists("./data.db"):
        migrate_db()

    if args.migrate:
        return migrate_db()
    if args.debug:
        app.run(debug=True)
    else:
        from waitress import serve

        print(f"Serving on {HOST}")
        serve(app, listen=HOST)


def str2bool(argument: str):
    if argument is None:
        return None

    if argument.lower() in ("yes", "true", "t", "y", "1"):
        return True
    elif argument.lower() in ("no", "false", "f", "n", "0"):
        return False
    else:
        return None


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--debug", type=str2bool, nargs="?", const=True, default=False)
    parser.add_argument("--migrate", type=str2bool, nargs="?", const=True)
    args = parser.parse_args()

    main(args)
