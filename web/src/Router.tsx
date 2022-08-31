import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Homepage } from "./pages/Home";
import { Librarypage } from "./pages/Library";
import { NovelViewpage } from "./pages/Novel";
import { Searchpage } from "./pages/Search";
import { AppPage } from "./wrappers/AppPage";

export const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppPage page={Homepage} />} />
        <Route
          path="/search"
          element={<AppPage page={Searchpage} title="Search" />}
        />
        <Route
          path="/library"
          element={<AppPage page={Librarypage} title="Your Library" />}
        />
        <Route
          path="/library/:novel_id"
          element={<AppPage page={Librarypage} title="Your Library" />}
        />
        <Route
          path="/novels/:novel_id"
          element={<AppPage page={NovelViewpage} title="View Novel" />}
        />
      </Routes>
    </BrowserRouter>
  );
};
