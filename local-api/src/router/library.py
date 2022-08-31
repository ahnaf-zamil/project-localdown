from datetime import datetime
from flask import Blueprint, jsonify, abort
from ..models import Library, db
from ..lib.api import get_novel_data
from ..utils import cache_novel, get_cached_novel
from sqlalchemy import desc

router = Blueprint("library", __name__, url_prefix="/library")


@router.get("/")
def get_novel_library():
    novel_ids = Library.query.order_by(desc(Library.added_at)).all()
    return jsonify([i.id for i in novel_ids])


@router.post("/add/<int:novel_id>")
def add_novel(novel_id):
    """Adds novel to library"""
    existing_entry = Library.query.filter_by(id=novel_id).first()
    if existing_entry:
        db.session.delete(existing_entry)
        db.session.commit()
        return jsonify({"status": "removed"})

    cached_novel = get_cached_novel(novel_id)
    if not cached_novel:
        # Caching novel info so that it doesnt have to be refetched
        data = get_novel_data(novel_id)
        if data is None:
            abort(404)
        cache_novel(novel_id, data)

    new_novel = Library(id=novel_id, added_at=datetime.now())
    db.session.add(new_novel)
    db.session.commit()

    return jsonify({"status": "added"})
