import Component from "../components/Header/AppName";
import { Meta, StoryObj } from "@storybook/nextjs";

export default {
  component: Component,
  title: "Lunarlight/AppName",
} as Meta<typeof Component>;

type Story = StoryObj<typeof Component>;

export const Default: Story = {};
