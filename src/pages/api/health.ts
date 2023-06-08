import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(_req: NextApiRequest, resp: NextApiResponse) {
  resp.status(200).send("ok");
}
