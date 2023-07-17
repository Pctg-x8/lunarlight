import { JsonRequestBody, PostAPI } from "..";

export class MisskeyStdAPI<Req, Resp> extends PostAPI<JsonRequestBody<Req>, Resp> {}
