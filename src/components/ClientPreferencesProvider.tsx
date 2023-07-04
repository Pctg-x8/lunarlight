"use client";

import LocalPreferences, { TimelineMode } from "@/models/localPreferences";
import { ReactNode, createContext, useMemo } from "react";

export type ClientPreferences = {
  readonly timelineMode: TimelineMode;
};
export const ClientPreferencesContext = createContext<ClientPreferences>({
  timelineMode: "normal",
});

export default function ClientPreferencesProvider({ children }: { readonly children: ReactNode }) {
  const value: ClientPreferences = useMemo(
    () => ({
      timelineMode: LocalPreferences.TIMELINE_MODE.load(),
    }),
    []
  );

  return <ClientPreferencesContext.Provider value={value}>{children}</ClientPreferencesContext.Provider>;
}
