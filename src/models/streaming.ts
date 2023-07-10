import { rpcClient } from "@/rpc/client";
import { Unsubscribable } from "@trpc/server/observable";
import { useEffect } from "react";
import * as streamingApi from "./api/mastodon/streaming";
import { Status } from "./status";

export abstract class Event {
  static fromApiData(event: streamingApi.Event) {
    switch (event.event) {
      case "update":
        return new UpdateEvent(event.stream, Status.fromApiData(JSON.parse(event.payload)));
      case "delete":
        return new DeleteEvent(event.stream, event.payload);
      default:
        throw new Error(`Unknown Streaming Event: ${event.event}`);
    }
  }
}

export class UpdateEvent extends Event {
  constructor(readonly streamTypes: string[], readonly status: Status) {
    super();
  }
}

export class DeleteEvent extends Event {
  constructor(readonly streamTypes: string[], readonly targetId: string) {
    super();
  }
}

export function streamEvents(stream: streamingApi.Streams, onNext: (event: Event) => void): Unsubscribable {
  return rpcClient.streamingTimeline.subscribe(
    { stream },
    {
      onData: e => {
        onNext(Event.fromApiData(e));
      },
    }
  );
}

export function useStreamEvents(stream: streamingApi.Streams, onNext: (event: Event) => void) {
  useEffect(() => {
    const sub = streamEvents(stream, onNext);

    return () => {
      sub.unsubscribe();
    };
  }, [stream, onNext]);
}
