import SuperJSON from "superjson";
import { RegisterOptions } from "superjson/dist/class-registry";
import { Class } from "superjson/dist/types";

export function superjsonSerializableClass(options?: RegisterOptions) {
  return (constructor: Class) => {
    SuperJSON.registerClass(constructor, options);
  };
}
