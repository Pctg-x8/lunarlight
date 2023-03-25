import { EmptyRequestBody, GetAPI, SearchParamsRequestBody } from "..";
import { type Account } from "./account";

export type Application = {
  readonly name: string;
  readonly website?: string | null;
};

export type Status = {
  readonly id: string;
  readonly created_at: string;
  readonly in_reply_to_id: string | null;
  readonly in_reply_to_account_id: string | null;
  readonly sensitive: boolean;
  readonly replies_count: number;
  readonly favourites_count: number;
  readonly reblogs_count: number;
  readonly content: string;
  readonly account: Account;
  readonly application?: Application;
  readonly spoiler_text?: string;
  readonly text?: string;
};

export type AccountStatusRequestParams = {
  readonly max_id?: string;
  readonly limit?: number;
};

export const getStatus = (id: string) =>
  new GetAPI<EmptyRequestBody, Status>(`api/v1/statuses/${encodeURIComponent(id)}`);
export const getStatusesForAccount = (id: string) =>
  new GetAPI<SearchParamsRequestBody<AccountStatusRequestParams>, Status>(
    `api/v1/accounts/${encodeURIComponent(id)}/statuses`
  );
