import React from "react";

export const Sidebar: React.FC = () => {
  return (
    <div className="h-full flex flex-col justify-between p-8 bg-gray-800 text-white border-r border-gray-600 roboto">
      <div>
        <h1 className="text-2xl font-light roboto">Project LocalDown</h1>
        <div className="flex flex-col my-12 gap-8 text-xl mx-2">
          <a href="/" className="flex gap-4 items-center">
            <i className="fa-solid fa-house"></i>Home
          </a>
          <a href="/library" className="flex gap-4 items-center">
            <i className="fa-solid fa-book"></i>Library
          </a>
          <a href="/search" className="flex gap-4 items-center">
            <i className="fa-solid fa-search"></i>Search
          </a>
        </div>
      </div>
      <p className="text-center text-gray-400">
        v{process.env.REACT_APP_VERSION}
      </p>
    </div>
  );
};
