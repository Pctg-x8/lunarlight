import { Button } from "@/components/Common/Button";
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
  },
};
export const Primary: Story = {
  args: {
    primary: true,
    children: "Button",
  },
};
export const Disabled: Story = {
  args: {
    children: "Button",
    disabled: true,
  },
};
