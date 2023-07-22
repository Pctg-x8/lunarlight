import Immutable from "immutable";
import SuperJson from "superjson";

SuperJson.registerCustom<Immutable.Map<string, string>, Record<string, string>>(
  {
    serialize: x => x.toObject(),
    deserialize: x => Immutable.Map(x),
    isApplicable: (x): x is Immutable.Map<string, string> => Immutable.isMap(x),
  },
  "Immutable.Map<string, string>"
);
