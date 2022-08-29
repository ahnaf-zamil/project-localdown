from .ext import db


class Novel(db.Model):
    __tablename__ = "novels"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.Text, nullable=False)
    cover_url = db.Column(db.Text, nullable=False)
    authors = db.Column(db.Text, nullable=False)
    genres = db.Column(db.Text, nullable=False)
    other_names = db.Column(db.Text)
    start_year = db.Column(db.Integer)
    publisher = db.Column(db.Text)
