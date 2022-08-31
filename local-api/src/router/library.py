from flask import Blueprint, jsonify
from ..models import Library, db
from ..lib.api import get_novel_data
from ..utils import cache_novel, get_cached_novel

router = Blueprint("library", __name__, url_prefix="/library")


@router.get("/")
def get_novel_library():
    return "here is library"


@router.post("/add/<int:novel_id>")
def add_novel(novel_id):
    """Adds novel to library"""
    existing_entry = Library.query.filter_by(id=novel_id).first()
    if existing_entry:
        db.session.delete(existing_entry)
        db.session.commit()
        return jsonify({"status": "removed"})

    cached_novel = get_cached_novel(novel_id)
    # try:
    if not cached_novel:
        # Caching novel info so that it doesnt have to be refetched
        data = get_novel_data(novel_id)
        cache_novel(novel_id, data)
    # except:
    # abort(404)

    new_novel = Library(id=novel_id)
    db.session.add(new_novel)
    db.session.commit()

    return jsonify({"status": "added"})
