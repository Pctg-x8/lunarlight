import z from "zod";

export const StreamsType = z.union([z.literal("user"), z.literal("public")]);
export type Streams = typeof StreamsType._type;

export type SubscribeParams = {
  readonly type?: Streams;
  readonly list?: string;
  readonly tag?: string;
};

export type Event = {
  readonly stream: string[];
  readonly event: string;
  readonly payload: string;
};
