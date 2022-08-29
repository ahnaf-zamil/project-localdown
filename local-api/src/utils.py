from datetime import datetime, timedelta
from typing import Optional
from .models import db, NovelCache


def get_cached_novel(novel_id: int) -> Optional[NovelCache]:
    # Returns novel if the novel is cached, else returns None
    cached_novel = NovelCache.query.filter_by(id=novel_id).first()
    if not cached_novel:
        return None
    elif datetime.now() > cached_novel.expires_at:
        return None
    else:
        return cached_novel


def cache_novel(novel_id: int, data: dict):
    """Updates or creates cache for novel"""
    existing_cache = NovelCache.query.filter_by(id=novel_id).first()
    next_expire = datetime.now() + timedelta(days=3)  # Cache expires every 3 days
    if not existing_cache:
        new_cache = NovelCache(
            id=novel_id,
            title=data["title"],
            cover_url=data["cover_url"],
            authors=data["authors"],
            genres=data["genres"],
            other_names=data["other_names"],
            start_year=data["start_year"],
            expires_at=next_expire,
        )
        db.session.add(new_cache)
    else:
        existing_cache.title = data["title"]
        existing_cache.cover_url = data["cover_url"]
        existing_cache.authors = data["authors"]
        existing_cache.genres = data["genres"]
        existing_cache.other_names = data["other_names"]
        existing_cache.start_year = data["start_year"]
        existing_cache.expires_at = next_expire

    db.session.commit()
