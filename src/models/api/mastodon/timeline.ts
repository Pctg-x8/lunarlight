import * as z from "zod";
import { AuthorizedGetAPI, GetAPI, SearchParamsRequestBody } from "..";
import { Status } from "./status";

export const HomeTimelineRequestParamsZ = z.object({
  max_id: z.string().optional(),
  since_id: z.string().optional(),
  min_id: z.string().optional(),
  limit: z.number().optional(),
});
export type HomeTimelineRequestParams = Readonly<typeof HomeTimelineRequestParamsZ._type>;

export const PublicTimelineRequestParamsZ = z.object({
  max_id: z.string().optional(),
  since_id: z.string().optional(),
  min_id: z.string().optional(),
  limit: z.number().optional(),
});
export type PublicTimelineRequestParams = Readonly<typeof PublicTimelineRequestParamsZ._type>;

export const homeTimeline = new AuthorizedGetAPI<SearchParamsRequestBody<HomeTimelineRequestParams>, Status[]>(
  "api/v1/timelines/home"
);

export const publicTimeline = new GetAPI<SearchParamsRequestBody<PublicTimelineRequestParams>, Status[]>(
  "api/v1/timelines/public"
);
