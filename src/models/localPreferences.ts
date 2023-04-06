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
    }
  }

  export const TIMELINE_MODE = new Key<TimelineMode>("TimelineMode", "normal");
}

export default LocalPreferences;
