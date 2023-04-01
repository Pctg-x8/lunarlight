import * as z from "zod";
import { AuthorizedGetAPI, SearchParamsRequestBody } from "..";
import { Status } from "./status";

export const HomeTimelineRequestParamsZ = z.object({
  max_id: z.string().optional(),
  since_id: z.string().optional(),
  min_id: z.string().optional(),
  limit: z.number().optional(),
});
export type HomeTimelineRequestParams = Readonly<typeof HomeTimelineRequestParamsZ._type>;
export const homeTimeline = new AuthorizedGetAPI<SearchParamsRequestBody<HomeTimelineRequestParams>, Status[]>(
  "api/v1/timelines/home"
);
