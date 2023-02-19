import { GetAPI } from "..";

export type Instance = {
  readonly domain: string;
};

export const getInstanceData = new GetAPI<Instance>("api/v2/instance", { cacheOptions: "force-cache" });
