from .lib.ext import db


class Library(db.Model):
    __tablename__ = "library"
    id = db.Column(db.Integer, primary_key=True)
    added_at = db.Column(db.DateTime, nullable=False)


class NovelCache(db.Model):
    id = db.Column(db.Integer, db.ForeignKey("library.id"), primary_key=True)
    title = db.Column(db.Text, nullable=False)
    cover_url = db.Column(db.Text, nullable=False)
    authors = db.Column(db.Text, nullable=False)
    genres = db.Column(db.Text, nullable=False)
    other_names = db.Column(db.Text)
    start_year = db.Column(db.Integer)

    # Cache expiry date
    expires_at = db.Column(db.DateTime, nullable=False)
