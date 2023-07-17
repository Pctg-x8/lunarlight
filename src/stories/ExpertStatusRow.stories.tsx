import Component from "@/components/StatusRow/Expert";
import { Status } from "@/models/status";
import { Meta, StoryObj } from "@storybook/react";

type StoryArgs = {
  readonly deleted: boolean;
  readonly onPreview: (status: Status) => void;
  readonly displayName: string;
  readonly content: string;
  readonly acct: string;
};
export default {
  component: Component,
  title: "Lunarlight/StatusRow/Expert",
  argTypes: {
    onPreview: {
      action: "onPreview",
    },
    // @ts-ignore
    status: {
      control: false,
    },
  },
  args: {
    content: "<p>test content <a hreF='#'>link here</a></p>",
    displayName: "test account",
    acct: "test_account@example.com",
  },
  render,
} satisfies Meta<StoryArgs>;

type Story = StoryObj<StoryArgs>;
function render({ deleted, onPreview, displayName, content, acct }: StoryArgs) {
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

  return <Component status={status} deleted={deleted} onPreview={onPreview} />;
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
