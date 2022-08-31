from flask import Blueprint
from . import library, novels

routes = Blueprint("routes", __name__)

routes.register_blueprint(novels.router)
routes.register_blueprint(library.router)
