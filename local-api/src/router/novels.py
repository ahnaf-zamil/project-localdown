from datetime import datetime, timedelta
from flask import Blueprint, abort, jsonify
from ..models import Library, NovelCache, db
from ..lib.api import get_novel_data
from ..utils import cache_novel, get_cached_novel

router = Blueprint("novels", __name__, url_prefix="/novels")


@router.get("/library")
def get_novel_library():
    return "here is library"


@router.get("/get/<int:novel_id>")
def get_novel(novel_id):
    # Checking for existing novel cache
    novel = get_cached_novel(novel_id)
    if novel:
        data = {
            "id": novel.id,
            "title": novel.title,
            "cover_url": novel.cover_url,
            "authors": novel.authors.capitalize(),
            "genres": novel.genres,
            "start_year": novel.start_year,
            "other_names": novel.other_names,
        }
    else:
        data = get_novel_data(novel_id)
        # Caching novel for later use
        cache_novel(data["id"], data)

    existing_entry = Library.query.filter_by(id=novel_id).first()
    if existing_entry:
        data["added_to_library"] = True
    else:
        data["added_to_library"] = False

    return jsonify(data)


@router.post("/add/<int:novel_id>")
def add_novel(novel_id):
    """Adds novel to library"""
    existing_entry = Library.query.filter_by(id=novel_id).first()
    if existing_entry:
        db.session.delete(existing_entry)
        db.session.commit()
        return jsonify({"status": "removed"})

    cached_novel = get_cached_novel(novel_id)
    try:
        if not cached_novel:
            # Caching novel info so that it doesnt have to be refetched
            data = get_novel_data(novel_id, status=True)
            cache_novel(existing_entry.id, data)
    except:
        abort(404)

    new_novel = Library(id=novel_id)
    db.session.add(new_novel)
    db.session.commit()

    return jsonify({"status": "added"})
