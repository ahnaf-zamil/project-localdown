import React, { useEffect, useState } from "react";
import { httpClient } from "../http";
import config from "../config.json";
import { TNovelPreview } from "../types";
import { useLocation } from "react-router-dom";
import { Loader } from "../components/Loader";

const Searchbar: React.FC = () => {
  const [query, setQuery] = useState<string>("");

  return (
    <div className="relative flex">
      <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
        <svg
          aria-hidden="true"
          className="w-5 h-5 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>
      </div>
      <input
        value={query}
        onChange={(e) => setQuery(e.currentTarget.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            window.location.href = `/search?q=${query}`;
          }
        }}
        type="search"
        className="focus:outline-none block p-4 pl-10 w-full text-sm text-gray-900 rounded-tl-lg rounded-bl-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Search Light Novels..."
        required
      />
      <button
        type="submit"
        onClick={() => (window.location.href = `/search?q=${query}`)}
        className="text-white bg-sky-700 hover:bg-sky-800 focus:outline-none font-medium rounded-tr-lg rounded-br-lg px-6 py-2"
      >
        Search
      </button>
    </div>
  );
};

export const SearchPage: React.FC = () => {
  const [results, setResults] = useState<Array<TNovelPreview> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const args = useLocation().search;
  const query = new URLSearchParams(args).get("q");

  const searchNovels = async (query: string) => {
    setLoading(true);
    setResults(null);
    if (query.length === 0) {
      return;
    }

    const resp = await httpClient.get(
      config.DATA_API + `/novels/search?q=${encodeURIComponent(query)}`
    );
    setResults(resp.data);
    setLoading(false);
  };

  useEffect(() => {
    if (query !== null) {
      searchNovels(query);
    }
  }, []);

  return (
    <div className="container h-full flex flex-col">
      <div>
        <h1 className="text-3xl text-center roboto mt-4 mb-8">SEARCH NOVELS</h1>
        <Searchbar />
      </div>
      <div className="relative grow">
        {loading && <Loader />}
        {results !== null ? (
          <div className="flex flex-col items-center">
            {results.length === 0 ? (
              <h1 className="text-center mt-12 text-3xl text-gray-600">
                No results found for '{query}'
              </h1>
            ) : (
              <>
                <h1 className="my-12 text-2xl text-gray-600">
                  Results for '{query}'
                </h1>
                <div className="w-11/12 flex flex-wrap justify-center lg:justify-between gap-16">
                  {results.map((novel, i) => (
                    <a
                      href={`/novels/${novel.id}`}
                      className="block w-[300px] p-4 flex flex-col items-center"
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
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};
