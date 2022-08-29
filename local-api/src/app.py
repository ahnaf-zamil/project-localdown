import os
from flask import Flask
from flask_cors import CORS
from .lib.ext import db


def make_app():
    from dotenv import load_dotenv

    load_dotenv()

    app = Flask(__name__)
    app.config[
        "SQLALCHEMY_DATABASE_URI"
    ] = f"sqlite:////{os.path.join(os.getcwd(), 'data.db')}"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)
    CORS(app)

    from .router import routes

    app.register_blueprint(routes)

    return app
