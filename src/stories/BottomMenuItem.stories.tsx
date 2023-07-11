import Component from "@/components/menu/BottomMenuItem";
import { faHouseChimney } from "@fortawesome/free-solid-svg-icons";
import { Meta, StoryObj } from "@storybook/react";
import { ComponentProps } from "react";

type StoryArgs = Omit<ComponentProps<typeof Component>, "children"> & {
  readonly title: string;
};
const meta: Meta<StoryArgs> = {
  component: Component,
  title: "Lunarlight/BottomMenuItem",
  args: {
    icon: faHouseChimney,
    href: "#",
  },
  render: args => {
    return <Component {...args}>{args.title}</Component>;
  },
};
export default meta;

type Story = StoryObj<StoryArgs>;

export const Default: Story = {
  args: {
    title: "MenuItem",
    active: false,
  },
};
export const Active: Story = {
  args: {
    title: "MenuItem",
    active: true,
  },
};
