import Button from "@/components/common/Button";
import { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Button> = {
  title: "Lunarlight/Common/Button",
  component: Button,
};
export default meta;

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
