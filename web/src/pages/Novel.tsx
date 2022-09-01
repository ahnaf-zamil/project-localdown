import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { httpClient } from "../http";
import { TNovelFull } from "../types";
import config from "../config.json";
import { Loader } from "../components/Loader";

export const NovelViewPage: React.FC = () => {
  const [novel, setNovel] = useState<TNovelFull | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { novel_id } = useParams();

  useEffect(() => {
    (async () => {
      const resp = await httpClient.get(
        config.LOCAL_API + `/novels/get/${novel_id}`
      );
      setNovel(resp.data);
      setLoading(false);
    })();
  }, []);

  const addToLibrary = async () => {
    if (novel?.added_to_library) {
      window.location.href = `/library/${novel.id}`;
      return;
    }

    setLoading(true);
    const resp = await httpClient.post(
      config.LOCAL_API + `/library/add/${novel_id}`
    );
    setNovel({
      ...novel,
      added_to_library: resp.data.status === "added",
    } as any);
    setLoading(false);
  };

  return (
    <div className="relative container p-4 h-full">
      {loading && <Loader fullScreen={true} />}
      {novel && (
        <div className="flex gap-10 roboto h-full">
          <div className="flex flex-col h-full">
            <img
              width="350"
              className="rounded hover:shadow-2xl transition duration-300"
              src={novel.cover_url}
              alt=""
            />
            <button
              onClick={addToLibrary}
              className={`${
                novel.added_to_library
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-sky-600 hover:bg-sky-700"
              } w-full text-white text-xl p-4 rounded mt-6 transition duration-300 flex items-center gap-5 justify-center`}
            >
              <i
                className={`fa-solid ${
                  novel.added_to_library ? "fa-book" : "fa-plus"
                }`}
              ></i>{" "}
              {novel.added_to_library ? "Read Novel" : "Add to Library"}
            </button>
          </div>
          <div className="roboto grow">
            <h1 className="text-3xl mb-4">{novel.title}</h1>
            <h2 className="text-gray-700">Also known as,</h2>
            {novel.other_names.split(", ").map((name, i) => (
              <p className="text-lg">{name}</p>
            ))}
            <h2 className="text-gray-700 mt-8">Author</h2>
            <p className="text-lg">{novel.authors}</p>
            <h2 className="text-gray-700 mt-6">Released On</h2>
            <p className="text-lg">{novel.start_year}</p>
            <h2 className="text-gray-700 mt-6">Publisher</h2>
            <p className="text-lg">{novel.publisher}</p>
            <h2 className="text-gray-700 mt-6">Genres</h2>
            <p className="text-lg">
              {novel.genres
                .toLowerCase()
                .split(", ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(", ")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
