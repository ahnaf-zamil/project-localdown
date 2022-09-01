import React, { useState } from "react";
import { Loader } from "./Loader";

interface Props {
  novelId: string;
}

export const ShowNovelContent: React.FC<Props> = () => {
  const [loading, setLoading] = useState<boolean>(true);

  return (
    <div className="grow bg-gray-100">
      <div className={`${loading ? "relative" : "hidden"} w-full h-full`}>
        <Loader />
        <h1 className="absolute bottom-5 text-center w-full text-gray-500 text-xl">
          Loading Content...
        </h1>
      </div>
    </div>
  );
};
