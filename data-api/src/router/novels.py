from flask import Blueprint, request, jsonify, abort
from sqlalchemy import or_, func
from ..models import Novel
from ..ext import db

router = Blueprint("novels", __name__, url_prefix="/novels")


@router.get("/search")
def search_ln():
    query = request.args["q"]

    # Searching with full phrase first. If value is found, use this as the first result
    # since pg triagram is a bit innacurate on multi-column fuzzy search
    # I just didn't want GIN indexes on it, so I decided to just write this weird query
    phrase_results = db.session.execute(
        f"""SELECT id, title, cover_url FROM {Novel.__tablename__} 
        WHERE title ILIKE :query OR other_names ILIKE :query LIMIT 1""",
        {"query": f"%{query}%"},
    )
    found_value = phrase_results.first()

    results = db.session.execute(
        f"""
        SELECT id, title, cover_url FROM {Novel.__tablename__} 
        WHERE SIMILARITY(title, :query) > 0.1 
        OR SIMILARITY(other_names, :query) > 0.1 
        {'AND id !={}'.format(found_value[0]) if found_value else ''} 
        ORDER BY GREATEST(SIMILARITY(title, :query), SIMILARITY(other_names, :query)) DESC 
        LIMIT 50""",
        {"query": query},
    )
    return_data = [{"id": i[0], "title": i[1], "cover_url": i[2]} for i in results]

    if found_value:
        return_data.insert(
            0,
            {
                "id": found_value[0],
                "title": found_value[1],
                "cover_url": found_value[2],
            },
        )

    return jsonify(return_data)


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
