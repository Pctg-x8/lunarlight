export type Streams = "user";

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
