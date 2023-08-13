import { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import NormalTimelineRow from "../components/TimelineRow/Normal";
import { Status } from "../models/status";

type StoryArgs = {
  readonly deleted: boolean;
  readonly displayName: string;
  readonly content: string;
  readonly acct: string;
};
export default {
  title: "Lunarlight/TimelineView/Normal",
  argTypes: {
    // @ts-ignore
    statuses: {
      control: false,
    },
  },
  args: {
    content: "<p>test content <a hreF='#'>link here</a></p>",
    displayName: "test account",
    acct: "test_account@example.com",
  },
  render,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
} satisfies Meta<StoryArgs>;

type Story = StoryObj<StoryArgs>;
function render({ deleted, displayName, content, acct }: StoryArgs) {
  const status = Status.fromApiData({
    id: "12345",
    created_at: Date.now().toString(),
    in_reply_to_account_id: null,
    in_reply_to_id: null,
    sensitive: false,
    replies_count: 0,
    favourites_count: 0,
    reblogs_count: 0,
    content,
    account: {
      id: "123456",
      display_name: displayName,
      username: "test_account",
      acct,
      avatar: "",
      header: "",
      note: "",
      fields: [],
      statuses_count: 1,
      following_count: 0,
      followers_count: 0,
    },
  });

  return (
    <ul>
      <NormalTimelineRow status={status} deleted={deleted} />
    </ul>
  );
}

export const Default: Story = {
  args: {
    deleted: false,
  },
};
export const Deleted: Story = {
  args: {
    deleted: true,
  },
};
