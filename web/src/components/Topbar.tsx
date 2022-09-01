import React from "react";
import config from "../config.json";

export interface Props {
  title?: string;
}

export const Topbar: React.FC<Props> = ({ title }) => {
  return (
    <div className="bg-dark-800 py-4 px-6 text-white flex justify-between items-center">
      <h1 className="text-xl">{title ? title : "Dashboard"}</h1>
      <a
        href={config.GITHUB_URL}
        rel="noreferrer"
        target="_blank"
        className="text-2xl"
      >
        <i className="fa-brands fa-github"></i>
      </a>
    </div>
  );
};
