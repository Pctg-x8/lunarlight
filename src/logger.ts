import pino from "pino";
import { isServer } from "./utils/server-client";

export function createAppLogger(options: pino.LoggerOptions) {
  if (isServer()) {
    const logStream =
      process.env.NODE_ENV === "development" ? require("pino-pretty")({ colorize: true }) : pino.destination(1);
    return pino(options, logStream);
  } else {
    return pino(options);
  }
}
