"use client";

import LocalPreferences, { TimelineMode } from "@/models/localPreferences";
import { styled } from "@linaria/react";
import { ChangeEvent, useCallback, useState } from "react";

export default function TimelineModePreferences(): JSX.Element {
  const [value, setValue] = useState(() => LocalPreferences.TIMELINE_MODE.load());
  const onChangeTimelineMode = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    LocalPreferences.TIMELINE_MODE.store(e.target.value as TimelineMode);
    setValue(e.target.value as TimelineMode);
  }, []);

  return (
    <article>
      <h1>タイムライン表示</h1>
      <form>
        <FormSelections>
          <li>
            <label htmlFor="NormalTimeline">
              <input
                type="radio"
                id="NormalTimeline"
                name="timelineMode"
                value="normal"
                checked={value === "normal"}
                onChange={onChangeTimelineMode}
              />
              通常表示
            </label>
          </li>
          <li>
            <label htmlFor="ExpertTimeline">
              <input
                type="radio"
                id="ExpertTimeline"
                name="timelineMode"
                value="expert"
                checked={value === "expert"}
                onChange={onChangeTimelineMode}
              />
              エキスパートモード
            </label>
          </li>
        </FormSelections>
      </form>
    </article>
  );
}

const FormSelections = styled.ul`
  display: flex;
  flex-direction: row;
  gap: 8px;
  margin: 16px;
`;
