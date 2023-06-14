import StatusRow from "@/components/StatusRow";
import { TimelineMode } from "@/models/localPreferences";
import { Status } from "@/models/status";
import { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof StatusRow> = {
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
};
export default meta;

type StoryArgs = {
  readonly mode: TimelineMode;
  readonly disabled: boolean;
  readonly onPreview: (status: Status) => void;
  readonly displayName: string;
  readonly content: string;
  readonly acct: string;
};
type Story = StoryObj<StoryArgs>;
function render({ mode, disabled, onPreview, displayName, content, acct }: StoryArgs) {
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

  return <StatusRow status={status} disabled={disabled} mode={mode} onPreview={onPreview} />;
}

export const Default: Story = {
  args: {
    mode: "normal",
    disabled: false,
    content: "<p>test content</p>",
    displayName: "test account",
    acct: "test_account@example.com",
  },
  render,
};
export const Disabled: Story = {
  args: {
    mode: "normal",
    disabled: true,
    content: "<p>test content</p>",
    displayName: "test account",
    acct: "test_account@example.com",
  },
  render,
};
export const Expert: Story = {
  args: {
    mode: "expert",
    disabled: false,
    content: "<p>test content</p>",
    displayName: "test account",
    acct: "test_account@example.com",
  },
  render,
};
export const ExpertDisabled: Story = {
  args: {
    mode: "expert",
    disabled: true,
    content: "<p>test content</p>",
    displayName: "test account",
    acct: "test_account@example.com",
  },
  render,
};
