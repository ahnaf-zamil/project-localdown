from flask import Blueprint, request, jsonify, abort
from sqlalchemy import or_, func
from ..models import Novel

router = Blueprint("novels", __name__, url_prefix="/novels")


@router.get("/search")
def search_ln():
    query = request.args["q"]
    results = (
        Novel.query.filter(
            or_(Novel.title.ilike(f"%{query}%"), Novel.other_names.ilike(f"%{query}%"))
        )
        .limit(52)
        .all()
    )
    return jsonify(
        [{"id": i.id, "title": i.title, "cover_url": i.cover_url} for i in results]
    )


@router.get("/get/<int:id>")
def get_novel(id):
    novel = Novel.query.filter_by(id=id).first()

    if not novel:
        abort(404)

    return jsonify(
        {
            "id": novel.id,
            "title": novel.title,
            "cover_url": novel.cover_url,
            "authors": novel.authors.capitalize(),
            "genres": novel.genres,
            "start_year": novel.start_year,
            "publisher": novel.publisher.capitalize(),
            "other_names": novel.other_names,
        }
    )
