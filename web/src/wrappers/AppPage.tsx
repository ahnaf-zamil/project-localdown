import React from "react";
import { Sidebar } from "../components/Sidebar";
import { Topbar } from "../components/Topbar";

interface Props {
  page: React.FC;
  title?: string;
}

export const AppPage: React.FC<Props> = ({ page, title }) => {
  return (
    <div>
      <div className="bg-gradient-to-b from-dark-500 to-dark-700 h-screen w-full flex">
        <Sidebar />
        <section className="grow flex flex-col">
          <Topbar title={title} />
          <div className="py-8 px-8 overflow-y-scroll h-full">{page({})}</div>
        </section>
      </div>
    </div>
  );
};
