from flask import Blueprint, jsonify, abort, request
from ..models import Library
from ..lib.api import get_novel_data
from ..lib.serialisers import novel_to_dict
from ..utils import cache_novel, get_cached_novel

router = Blueprint("novels", __name__, url_prefix="/novels")


@router.get("/get/<int:novel_id>")
def get_novel(novel_id):
    # Checking for existing novel cache
    novel = get_cached_novel(novel_id)
    if novel:
        data = novel_to_dict(novel)
    else:
        data = get_novel_data(novel_id)
        if data is None:
            abort(404)
        # Caching novel for later use
        cache_novel(data["id"], data)

    existing_entry = Library.query.filter_by(id=novel_id).first()
    if existing_entry:
        data["added_to_library"] = True
    else:
        data["added_to_library"] = False

    return jsonify(data)
