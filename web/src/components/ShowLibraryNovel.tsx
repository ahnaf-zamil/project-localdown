import React from "react";
import { httpClient } from "../http";
import { TNovelFull } from "../types";
import config from "../config.json";

export interface Props {
  novel: TNovelFull;
}

export const ShowLibraryNovel: React.FC<Props> = ({ novel }) => {
  const removeFromLibrary = async () => {
    await httpClient.post(config.LOCAL_API + `/library/add/${novel.id}`);
    window.location.href = "/library";
  };

  return (
    <>
      {novel && (
        <div className="container w-11/12 mt-4 flex gap-10 roboto justify-center">
          <div className="flex flex-col h-full">
            <img
              width="350"
              className="rounded hover:shadow-2xl transition duration-300"
              src={novel.cover_url}
              alt=""
            />
            <button
              onClick={removeFromLibrary}
              className={`bg-rose-500 hover:bg-rose-600 w-full text-white text-xl p-4 rounded mt-6 transition duration-300 flex items-center gap-5 justify-center`}
            >
              <i className={`fa-solid fa-trash`}></i> Remove from Library
            </button>
          </div>
          <div className="roboto grow">
            <h1 className="text-3xl">{novel.title}</h1>
            <h2 className="text-gray-700 mt-6">Author</h2>
            <p className="text-lg">{novel.authors}</p>
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
    </>
  );
};
