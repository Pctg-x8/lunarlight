import pino from "pino";
import pretty from "pino-pretty";

export function createAppLogger(options: pino.LoggerOptions) {
  const logStream = process.env.NODE_ENV === "development" ? pretty({ colorize: true }) : pino.destination(1);
  return pino(options, logStream);
}
