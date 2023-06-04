export type Streams = "user";

export type SubscribeParams = {
  readonly type?: Streams;
  readonly list?: string;
  readonly tag?: string;
};
