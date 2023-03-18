import { AuthorizedGetAPI, GetAPI } from "..";

export type AccountField = {
  readonly name: string;
  readonly value: string;
  readonly verified_at: string;
};
export type Account = {
  readonly id: string;
  readonly display_name: string;
  readonly username: string;
  readonly acct: string;
  readonly avatar: string;
  readonly header: string;
  readonly note: string;
  readonly fields: AccountField[];
  readonly statuses_count: number;
  readonly following_count: number;
  readonly followers_count: number;
};
export type CredentialAccount = Account;

export function isRemoteAccount(a: Account): boolean {
  // from api docs: https://docs.joinmastodon.org/entities/Account/#acct
  return a.username !== a.acct;
}

export type AccountLookupRequestParams = {
  readonly acct: string;
};

export const lookup = new GetAPI<AccountLookupRequestParams, Account>(`api/v1/accounts/lookup`);
export const verifyCredentials = new AuthorizedGetAPI<{}, CredentialAccount>("api/v1/accounts/verify_credentials");
