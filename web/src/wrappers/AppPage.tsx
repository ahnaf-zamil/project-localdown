import React from "react";
import { Sidebar } from "../components/Sidebar";
import { Topbar } from "../components/Topbar";

interface Props {
  page: React.FC;
}

export const AppPage: React.FC<Props> = ({ page }) => {
  return (
    <div>
      <div className="bg-gray-200 h-screen w-full flex">
        <Sidebar />
        <section className="grow flex flex-col">
          <Topbar />
          <div className="py-8 px-8 overflow-y-scroll h-full">{page({})}</div>
        </section>
      </div>
    </div>
  );
};