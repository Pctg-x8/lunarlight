import { cookie } from "@/utils/cookie";
import ProdInstance, { HTTPError } from "./api";
import { CredentialAccount, verifyCredentials } from "./api/mastodon/account";

export async function getAuthorizedUserServerProps(): Promise<{ readonly account: CredentialAccount | undefined }> {
  const token = cookie.token();

  let account: CredentialAccount | undefined = undefined;
  if (token) {
    const instance = new ProdInstance().withAuthorizationToken(token);
    try {
      account = await verifyCredentials.send({}, instance);
    } catch (e) {
      if (
        e instanceof HTTPError.ForbiddenError ||
        e instanceof HTTPError.UnauthorizedError ||
        e instanceof HTTPError.UnprocessableEntityError
      ) {
        // TODO: revoke current token
      } else {
        throw e;
      }
    }
  }

  return { account };
}
