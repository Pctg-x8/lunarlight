import { GetAPI } from "..";

export type Account = {
  readonly display_name: string;
  readonly username: string;
  readonly acct: string;
  readonly avatar: string;
};
export function isRemoteAccount(a: Account): boolean {
  // from api docs: https://docs.joinmastodon.org/entities/Account/#acct
  return a.username !== a.acct;
}

export type Application = {
  readonly name: string;
  readonly website?: string | null;
};

export type Status = {
  readonly created_at: string;
  readonly in_reply_to_id: string | null;
  readonly in_reply_to_account_id: string | null;
  readonly sensitive: boolean;
  readonly replies_count: number;
  readonly reblogs_count: number;
  readonly content: string;
  readonly account: Account;
  readonly application?: Application;
};

export const getStatus = (id: string) => new GetAPI<Status>(`api/v1/statuses/${encodeURIComponent(id)}`);
