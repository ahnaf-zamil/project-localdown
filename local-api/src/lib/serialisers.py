from ..models import NovelCache


def novel_to_dict(novel: NovelCache):
    return {
        "id": novel.id,
        "title": novel.title,
        "cover_url": novel.cover_url,
        "authors": novel.authors.capitalize(),
        "genres": novel.genres,
        "start_year": novel.start_year,
        "other_names": novel.other_names,
    }
