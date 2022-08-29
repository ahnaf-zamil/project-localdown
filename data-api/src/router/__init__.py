from flask import Blueprint
from . import novels

routes = Blueprint("routes", __name__)

routes.register_blueprint(novels.router)
