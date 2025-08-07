import Component from "@/components/StatusActions";
import { Status } from "@/models/status";
import { Meta, StoryObj } from "@storybook/nextjs";

export default {
  component: Component,
  title: "Lunarlight/StatusActions",
} satisfies Meta<typeof Component>;

type StoryArgs = {
  readonly reply_count: number;
  readonly favorite_count: number;
  readonly reblog_count: number;
  readonly disabled: boolean;
};
type Story = StoryObj<StoryArgs>;
function render({ reply_count, favorite_count, reblog_count, disabled }: StoryArgs) {
  const status = Status.fromApiData({
    id: "12345",
    created_at: Date.now().toString(),
    in_reply_to_account_id: null,
    in_reply_to_id: null,
    sensitive: false,
    replies_count: reply_count,
    favourites_count: favorite_count,
    reblogs_count: reblog_count,
    content: "test content",
    account: {
      id: "123456",
      display_name: "test account",
      username: "test_account",
      acct: "test_account@example.com",
      avatar: "",
      header: "",
      note: "",
      fields: [],
      statuses_count: 1,
      following_count: 0,
      followers_count: 0,
    },
  });

  return <Component status={status} disabled={disabled} />;
}

export const Default: Story = {
  args: {
    reply_count: 0,
    favorite_count: 0,
    reblog_count: 0,
    disabled: false,
  },
  argTypes: {
    // @ts-ignore
    status: {
      control: false,
    },
  },
  render,
};

export const Disabled: Story = {
  args: {
    reply_count: 0,
    favorite_count: 0,
    reblog_count: 0,
    disabled: true,
  },
  argTypes: {
    // @ts-ignore
    status: {
      control: false,
    },
  },
  render,
};
