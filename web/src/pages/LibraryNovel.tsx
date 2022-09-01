import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader } from "../components/Loader";
import { getNovel, removeFromLibrary } from "../http";
import { TNovelFull } from "../types";
import { ShowNovelContent } from "../components/ShowNovelContent";

interface Props {
  novelObj?: TNovelFull | null;
}

export const LibraryNovelPage: React.FC<Props> = ({ novelObj }) => {
  const [novel, setNovel] = useState<TNovelFull | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { novel_id } = useParams();

  useEffect(() => {
    (async () => {
      if (!novelObj?.id) {
        const data = await getNovel(novel_id!);
        setNovel(data);
      } else {
        setNovel(novelObj!);
      }
      setLoading(false);
    })();
  }, []);

  return (
    <div className="relative container p-2 h-full bg-dark-500">
      {loading && <Loader fullScreen={true} />}
      {novel && (
        <div className={`${novelObj && "p-4"} flex gap-10 roboto h-full`}>
          <div className="flex flex-col h-full">
            <img
              width="350"
              className="rounded hover:shadow-2xl transition duration-300"
              src={novel.cover_url}
              alt=""
            />
            <button
              onClick={() => removeFromLibrary(novel.id.toString())}
              className={`bg-rose-500 hover:bg-rose-600 w-full text-white text-xl p-4 rounded mt-6 transition duration-300 flex items-center gap-5 justify-center`}
            >
              <i className={`fa-solid fa-trash`}></i> Remove from Library
            </button>
          </div>
          <div className="roboto grow flex-col flex">
            <div className="mb">
              <h1 className="text-3xl mb-4">{novel.title}</h1>

              <h2 className="text-gray-400 mt-6">Author</h2>
              <p className="text-lg">{novel.authors}</p>
              <h2 className="text-gray-400 mt-6">Released On</h2>
              <p className="text-lg">{novel.start_year}</p>

              <h2 className="text-gray-400 mt-6">Genres</h2>
              <p className="text-lg">
                {novel.genres
                  .toLowerCase()
                  .split(", ")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(", ")}
              </p>
            </div>
            <h1 className="text-gray-400 text-lg my-6">Volumes/Chapters</h1>
            <ShowNovelContent novelId={novel.id.toString()} />
          </div>
        </div>
      )}
    </div>
  );
};
