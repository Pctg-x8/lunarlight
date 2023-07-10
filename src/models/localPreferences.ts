import { useSyncExternalStore } from "react";

export type TimelineMode = "normal" | "expert";

namespace LocalPreferences {
  export class Key<T> {
    private readonly storageKey: string;

    constructor(name: string, private readonly defaultValue: T) {
      this.storageKey = `ll.prefs.${name}`;
    }

    load(): T {
      const rawValue = window.localStorage.getItem(this.storageKey);
      return rawValue === undefined || rawValue === null ? this.defaultValue : JSON.parse(rawValue);
    }

    store(value: T): void {
      window.localStorage.setItem(this.storageKey, JSON.stringify(value));
      window.dispatchEvent(new Event("ll.LocalPreferencesChanged"));
    }

    useReactiveValue(serverValue: T): T {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      return useSyncExternalStore(
        cb => {
          window.addEventListener("ll.LocalPreferencesChanged", cb);

          return () => {
            window.removeEventListener("ll.LocalPreferencesChanged", cb);
          };
        },
        () => this.load(),
        () => serverValue
      );
    }
  }

  export const TIMELINE_MODE = new Key<TimelineMode>("TimelineMode", "normal");
}

export default LocalPreferences;
