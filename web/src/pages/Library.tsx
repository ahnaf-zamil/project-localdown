import React, { useEffect, useState } from "react";
import { getNovel, getNovelIds } from "../http";
import { TNovelFull } from "../types";
import { Loader } from "../components/Loader";
import SlidingPane from "react-sliding-pane";
import { LibraryNovelPage } from "./LibraryNovel";

const shouldStopLoading = (index: number, length: number) => {
  if (length <= 10 && index + 1 !== length) {
    return false;
  } else if (index === Math.floor(length / 2)) {
    return true;
  } else if (index + 1 === length) {
    return true;
  }
  return false;
};

export const LibraryPage: React.FC = () => {
  const [viewNovel, setViewNovel] = useState<TNovelFull | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [novels, setNovels] = useState<Array<TNovelFull>>([]);

  useEffect(() => {
    (async () => {
      const novelIds = await getNovelIds();
      for (let i = 0; i < novelIds.length; i++) {
        if (shouldStopLoading(i, novelIds.length)) {
          setLoading(false);
        }

        const data = await getNovel(novelIds[i].toString());
        setNovels((currentNovels) => [...currentNovels, data]);
      }
      setLoading(false);
    })();
  }, []);

  return (
    <div className="relative container p-4 h-full bg-inherit">
      {loading && <Loader fullScreen={true} />}
      <SlidingPane
        isOpen={viewNovel != null}
        title={viewNovel != null ? viewNovel.title : ""}
        subtitle={`Novel ID: ${viewNovel != null ? viewNovel?.id : ""}`}
        onRequestClose={() => {
          setViewNovel(null);
        }}
      >
        {/* <ShowLibraryNovel novel={viewNovel!} /> */}
        <LibraryNovelPage novelObj={viewNovel} />
      </SlidingPane>
      <div className="w-11/12 flex flex-col roboto h-full items-center">
        <div className="w-full mb-10">
          <h1 className="text-3xl mb-2 text-header">Library</h1>
          <h2 className="text-xl text-gray-200">
            All of the books you saved are here. If you can't find something,
            search it below {":)"}
          </h2>
        </div>
        <div
          className={`w-full flex flex-wrap gap-x-16 gap-y-8 justify-center lg:justify-start`}
        >
          {novels.map((novel, i) => {
            return (
              <div className="w-[290px] p-4 flex flex-col items-center">
                <img
                  onClick={() => {
                    setViewNovel(novel);
                  }}
                  className="cursor-pointer transition hover:shadow-xl"
                  src={novel.cover_url}
                  alt=""
                />
                <h1 className="text-lg w-full text-center mt-6 roboto">
                  {novel.title.length > 100
                    ? novel.title.substring(0, 100) + "..."
                    : novel.title}
                </h1>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
