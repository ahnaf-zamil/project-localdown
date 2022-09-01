import React from "react";
import loader from "../img/loader.svg";

interface Props {
  fullScreen?: boolean;
}

export const Loader: React.FC<Props> = ({ fullScreen }) => {
  return (
    <div
      className={`w-full h-full flex items-center justify-center ${
        fullScreen ? "absolute z-10 top-0 left-0 bg-gray-200/60" : ""
      }`}
    >
      <img src={loader} alt="" />
    </div>
  );
};
