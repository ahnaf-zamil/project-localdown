import requests
import os


def get_novel_data(novel_id: int, status: bool = False):
    """Fetches novel data from Data API

    If 'status' is set to True, it only returns status code. This is for checking
    if that novel exists in the database or not.
    """
    resp = requests.get(os.environ["DATA_API"] + f"/novels/get/{novel_id}")
    return resp.json() if not status else resp.status_code
