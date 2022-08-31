import React, { useEffect, useState } from "react";
import { httpClient } from "../http";
import { TNovelFull } from "../types";
import config from "../config.json";
import { Loader } from "../components/Loader";
import SlidingPane from "react-sliding-pane";
import { ShowLibraryNovel } from "../components/ShowLibraryNovel";
import { Navigate, useParams } from "react-router-dom";

const shouldStopLoading = (index: number, length: number) => {
  if (length <= 10 && index + 1 != length) {
    return false;
  } else if (index === Math.floor(length / 2)) {
    return true;
  } else if (index + 1 === length) {
    return true;
  }
  return false;
};

export const Librarypage: React.FC = () => {
  const [viewNovel, setViewNovel] = useState<TNovelFull | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [novels, setNovels] = useState<Array<TNovelFull>>([]);
  let { novel_id } = useParams();

  useEffect(() => {
    const getNovelIds = async (): Promise<Array<number>> => {
      const resp = await httpClient.get(config.LOCAL_API + "/library/");
      return resp.data;
    };

    const getURLParamNovel = async () => {
      // Make it a first request if there's a novel ID in URL param
      if (novel_id) {
        try {
          const resp = await httpClient.get(
            config.LOCAL_API + `/novels/get/${novel_id}`
          );

          setViewNovel(resp.data);
          setNovels((currentNovels) => [...currentNovels, resp.data]);
        } catch {
          novel_id = undefined;
        }
      }
    };

    (async () => {
      await getURLParamNovel();

      const novelIds = await getNovelIds();
      for (let i = 0; i < novelIds.length; i++) {
        if (shouldStopLoading(i, novelIds.length)) {
          setLoading(false);
        }

        if (novel_id == novelIds[i].toString()) {
          // If current iterated novel ID is same as arg novel ID
          // then don't make request because it has been made before
          continue;
        }

        const resp = await httpClient.get(
          config.LOCAL_API + `/novels/get/${novelIds[i]}?preview=true`
        );

        setNovels((currentNovels) => [...currentNovels, resp.data]);
      }
    })();
  }, []);

  return (
    <div className="relative container p-4 h-full">
      {loading && <Loader fullScreen={true} />}
      <SlidingPane
        isOpen={viewNovel != null}
        title={viewNovel != null ? viewNovel.title : ""}
        subtitle={`Novel ID: ${viewNovel != null ? viewNovel?.id : ""}`}
        onRequestClose={() => {
          setViewNovel(null);
          window.history.replaceState(null, "", "/library");
        }}
      >
        <ShowLibraryNovel novel={viewNovel!} />
      </SlidingPane>
      <div className="w-11/12 flex flex-col roboto h-full items-center">
        <div className="w-full mb-10">
          <h1 className="text-3xl mb-2">Library</h1>
          <h2 className="text-xl text-gray-800">
            All of the books you saved are here. If you can't find something,
            search it below {":)"}
          </h2>
        </div>
        <div className="flex flex-wrap justify-center xl:justify-between gap-16">
          {novels.map((novel, i) => {
            return (
              <div
                onClick={() => {
                  window.history.replaceState(null, "", `/library/${novel.id}`);
                  setViewNovel(novel);
                }}
                className="cursor-pointer w-[250px] p-4 flex flex-col items-center"
              >
                <img
                  width="250"
                  className="transition hover:shadow-xl"
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
