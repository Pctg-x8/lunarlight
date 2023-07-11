import Component from "@/components/menu/MenuItem";
import { isDefined } from "@/utils";
import { faHouseChimney } from "@fortawesome/free-solid-svg-icons";
import { Meta, StoryObj } from "@storybook/react";
import { ComponentProps } from "react";

type StoryArgs = Omit<ComponentProps<typeof Component>, "children"> & {
  readonly title: string;
  readonly shortTitle?: string;
};
const meta: Meta<StoryArgs> = {
  component: Component,
  title: "Lunarlight/MenuItem",
  args: {
    icon: faHouseChimney,
    href: "#",
  },
  render: args => {
    if (isDefined(args.shortTitle)) {
      return (
        <Component {...args}>
          <Component.FullLabel>{args.title}</Component.FullLabel>
          <Component.ShortLabel>{args.shortTitle}</Component.ShortLabel>
        </Component>
      );
    }

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
export const ShortTitle: Story = {
  args: {
    title: "MenuItem",
    shortTitle: "Item",
    active: false,
  },
};
