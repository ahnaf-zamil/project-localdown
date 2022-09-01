import axios from "axios";
import { TNovelFull } from "./types";
import config from "./config.json";

export const httpClient = axios.create();

export const getNovelIds = async (): Promise<Array<number>> => {
  const resp = await httpClient.get(config.LOCAL_API + "/library/");
  return resp.data;
};

export const getNovel = async (novelId: string): Promise<TNovelFull> => {
  const resp = await httpClient.get(
    config.LOCAL_API + `/novels/get/${novelId}`
  );
  return resp.data;
};

export const removeFromLibrary = async (novelId: string) => {
  await httpClient.post(config.LOCAL_API + `/library/add/${novelId}`);
  window.location.href = "/library";
};
