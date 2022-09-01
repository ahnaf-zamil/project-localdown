import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/Home";
import { LibraryPage } from "./pages/Library";
import { LibraryNovelPage } from "./pages/LibraryNovel";
import { NovelViewPage } from "./pages/Novel";
import { SearchPage } from "./pages/Search";
import { AppPage } from "./wrappers/AppPage";

export const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppPage page={HomePage} />} />
        <Route
          path="/search"
          element={<AppPage page={SearchPage} title="Search" />}
        />
        <Route
          path="/library"
          element={<AppPage page={LibraryPage} title="Your Library" />}
        />
        <Route
          path="/library/:novel_id"
          element={<AppPage page={LibraryNovelPage} title="View Novel" />}
        />
        <Route
          path="/novels/:novel_id"
          element={<AppPage page={NovelViewPage} title="Novel" />}
        />
      </Routes>
    </BrowserRouter>
  );
};
