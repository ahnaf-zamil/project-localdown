"""
A modified version of the Novelupdates scraper by shaido987
Source: https://github.com/shaido987/novel-dataset-scraper
"""

import re
import cfscrape
import argparse
import pandas as pd
import numpy as np
from time import sleep
from bs4 import BeautifulSoup
from utils import get_value, str2bool, get_value_str_txt, is_empty, progressbar


class NovelScraper:
    def __init__(self, delay=0.5, debug=False):
        self.delay = delay
        self.debug = debug
        self.NOVEL_LIST_URL = "http://www.novelupdates.com/novelslisting/?st=1&pg="
        self.NOVEL_SINGLE_URL = "http://www.novelupdates.com/?p="
        self.scraper = cfscrape.create_scraper()

    def parse_all_novels(self):
        novel_ids = self.get_all_novel_ids()

        all_novel_information = []
        for novel_id in progressbar(
            novel_ids, prefix="Parsing novels: ", suffix="current novel id: "
        ):
            info = self.parse_single_novel(novel_id)
            all_novel_information.append(info)
            sleep(self.delay)
        return all_novel_information

    def parse_single_novel(self, novel_id):
        page = self.scraper.get(self.NOVEL_SINGLE_URL + str(novel_id))
        soup = BeautifulSoup(page.content, "html.parser")
        content = soup.find("div", attrs={"class": "w-blog-content"})
        if content is None:
            return dict()

        data = (
            {"id": novel_id}
            .update(self.general_info(content))
            .update(self.publisher_info(content))
            .update(self.chapter_info(content))
        )

        return data

    def get_all_novel_ids(self):
        page = self.scraper.get(self.NOVEL_LIST_URL + "1")
        novels_num_pages = self.get_novel_list_num_pages(page)
        print("Page count:", novels_num_pages)
        all_novel_ids = []
        page_nums = progressbar(
            range(1, novels_num_pages + 1),
            prefix="Obtaining novel ids: ",
            suffix="current page: ",
        )
        for page_num in page_nums:
            page = self.scraper.get(self.NOVEL_LIST_URL + str(page_num))
            novel_ids = self.get_novel_ids(page)
            all_novel_ids.extend(novel_ids)
            sleep(self.delay)
        return all_novel_ids

    @staticmethod
    def get_novel_list_num_pages(page):
        soup = BeautifulSoup(page.text, "html.parser")
        dig_pag = soup.find("div", attrs={"class": "digg_pagination"})
        max_page = max([int(a.text) for a in dig_pag.find_all("a") if a.text.isdigit()])
        return max_page

    @staticmethod
    def get_novel_ids(page):
        soup = BeautifulSoup(page.text, "html.parser")
        table = soup.find("div", attrs={"class": "w-blog-content other"})
        novels = table.find_all("div", attrs={"class": "search_title"})
        novel_ids = [
            novel.find("span", attrs={"class": "rl_icons_en"}).get("id")[3:]
            for novel in novels
        ]
        novel_ids = [int(n) for n in novel_ids]
        return novel_ids

    @staticmethod
    def general_info(content):
        gen_info = dict()
        gen_info["name"] = get_value(
            content.find("div", attrs={"class", "seriestitlenu"})
        )
        gen_info["cover"] = content.find("div", attrs={"class": "seriesimg"}).find(
            "img"
        )["src"]
        gen_info["assoc_names"] = get_value(
            content.find("div", attrs={"id": "editassociated"}),
            check=lambda e: e,
            parse=lambda e: list(e.stripped_strings),
        )
        gen_info["original_language"] = get_value(
            content.find("div", attrs={"id": "showlang"}),
            lambda e: e.a,
            lambda e: e.text.strip().lower(),
        )
        gen_info["authors"] = [
            author.text.lower()
            for author in content.find("div", attrs={"id": "showauthors"}).find_all("a")
        ]
        gen_info["genres"] = [
            genre.text.lower()
            for genre in content.find("div", attrs={"id": "seriesgenre"}).find_all(
                "a", attrs={"class": "genre"}
            )
        ]
        return gen_info

    @staticmethod
    def publisher_info(content):
        pub_info = dict()
        pub_info["start_year"] = get_value(
            content.find("div", attrs={"id": "edityear"}),
        )
        pub_info["licensed"] = str2bool(
            get_value(content.find("div", attrs={"id": "showlicensed"}))
        )
        pub_info["original_publisher"] = get_value(
            content.find("div", attrs={"id": "showopublisher"}),
            lambda e: e.a,
            lambda e: e.a.string.strip().lower(),
        )
        pub_info["english_publisher"] = get_value(
            content.find("div", attrs={"id": "showepublisher"}),
            lambda e: e.a,
            lambda e: e.a.string.strip().lower(),
        )
        return pub_info

    @staticmethod
    def chapter_info(content):
        chap_info = dict()
        chapter_status = get_value_str_txt(
            content.find("div", attrs={"id": "editstatus"})
        )

        if chapter_status is not None:
            chap_info["complete_original"] = "complete" in chapter_status.lower()
            chapter_current = re.search(r"(\d+)[ wnl]*(?=chap)", chapter_status.lower())
            if chapter_current is not None:
                chapter_current = chapter_current.group(1).strip() + " chapters"
            else:
                # Check if volume
                chapter_current = re.search(
                    r"(\d+)[ wnl]*(?=volu)", chapter_status.lower()
                )
                if chapter_current is not None:
                    chapter_current = chapter_current.group(1).strip() + " volumes"
                else:
                    # Get the first number
                    chapter_current = re.search(r"(\d+)", chapter_status.lower())
                    if chapter_current is not None:
                        chapter_current = chapter_current.group(1).strip()

            chap_info["chapters_original_current"] = (
                chapter_current if chapter_current != "" else None
            )
        chap_info["complete_translated"] = str2bool(
            get_value(content.find("div", attrs={"id": "showtranslated"}))
        )

        table = content.find("table", attrs={"id": "myTable"})
        if table is not None:
            release_table = table.find("tbody")
            chap_info["chapter_latest_translated"] = (
                release_table.find("tr").find_all("td")[2].a.string.strip()
            )
        return chap_info


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--debug", type=str2bool, nargs="?", const=True, default=False)
    parser.add_argument("--delay", type=float, default=0.5)
    parser.add_argument("--novel_id", type=int, default=-1)
    parser.add_argument("--version_number", type=str, default="0.1.2")
    args = parser.parse_args()

    novel_scraper = NovelScraper(args.delay, args.debug)

    if args.novel_id == -1:
        # Scrape all novels
        novel_info = novel_scraper.parse_all_novels()
    else:
        novel_info = [novel_scraper.parse_single_novel(args.novel_id)]

    df = pd.DataFrame(novel_info)
    if not args.debug:
        file_name = f"novels_{args.version_number}.csv"
    else:
        file_name = "novels_data.csv"

    # Save to csv file
    df.to_csv(file_name, header=True, index=False)
