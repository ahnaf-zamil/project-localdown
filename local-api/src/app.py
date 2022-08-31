import os
import re
from flask import Flask
from flask_cors import CORS
from .lib.ext import db


def make_app():
    from dotenv import load_dotenv

    load_dotenv()

    db_path_raw = os.path.join(os.getcwd(), "data.db")

    if os.name == "nt":
        db_path_raw = db_path_raw.replace("\\", "\\\\")
    else:
        db_path_raw = "/" + db_path_raw  # Linux absolute path

    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{db_path_raw}"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)
    CORS(app)

    from .router import routes

    app.register_blueprint(routes)

    return app
