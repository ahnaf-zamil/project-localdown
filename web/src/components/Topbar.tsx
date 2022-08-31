import React from "react";

export interface Props {
  title?: string;
}

export const Topbar: React.FC<Props> = ({ title }) => {
  return (
    <div className="bg-gray-700 py-4 px-6 text-white">
      <h1 className="text-xl">{title ? title : "Dashboard"}</h1>
    </div>
  );
};
