import Button from "@/components/common/Button";
import { Meta, StoryObj } from "@storybook/react";

export default {
  title: "Lunarlight/Common/Button",
  component: Button,
} satisfies Meta<typeof Button>;

type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: "Button",
    variant: "primary",
    disabled: false,
  },
};
export const Primary: Story = {
  args: {
    disabled: false,
    variant: "primary",
    children: "Button",
  },
};
export const Disabled: Story = {
  args: {
    children: "Button",
    disabled: true,
  },
};
