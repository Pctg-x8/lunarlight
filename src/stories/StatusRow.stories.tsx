import StatusRow from "@/components/StatusRow";
import { TimelineMode } from "@/models/localPreferences";
import { Status } from "@/models/status";
import { Meta, StoryObj } from "@storybook/react";

export default {
  component: StatusRow,
  title: "Lunarlight/StatusRow",
  argTypes: {
    status: {
      control: false,
    },
    onPreview: {
      action: "onPreview",
    },
  },
} satisfies Meta<typeof StatusRow>;

type StoryArgs = {
  readonly mode: TimelineMode;
  readonly deleted: boolean;
  readonly onPreview: (status: Status) => void;
  readonly displayName: string;
  readonly content: string;
  readonly acct: string;
};
type Story = StoryObj<StoryArgs>;
function render({ mode, deleted, onPreview, displayName, content, acct }: StoryArgs) {
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

  return <StatusRow status={status} deleted={deleted} mode={mode} onPreview={onPreview} />;
}

export const Default: Story = {
  args: {
    mode: "normal",
    deleted: false,
    content: "<p>test content</p>",
    displayName: "test account",
    acct: "test_account@example.com",
  },
  render,
};
export const Deleted: Story = {
  args: {
    mode: "normal",
    deleted: true,
    content: "<p>test content</p>",
    displayName: "test account",
    acct: "test_account@example.com",
  },
  render,
};
export const Expert: Story = {
  args: {
    mode: "expert",
    deleted: false,
    content: "<p>test content</p>",
    displayName: "test account",
    acct: "test_account@example.com",
  },
  render,
};
export const ExpertDeleted: Story = {
  args: {
    mode: "expert",
    deleted: true,
    content: "<p>test content</p>",
    displayName: "test account",
    acct: "test_account@example.com",
  },
  render,
};
