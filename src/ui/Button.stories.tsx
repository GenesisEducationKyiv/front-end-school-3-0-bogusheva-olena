/// <reference path="../../svg.d.ts" />
import { type Meta, type StoryObj } from "@storybook/react";
import Button from "./Button";
import PlayIcon from "../assets/icons/play.svg?react";
import PauseIcon from "../assets/icons/pause.svg?react";
import CloseIcon from "../assets/icons/close.svg?react";

const meta: Meta<typeof Button> = {
    title: "UI/Button",
    component: Button,
    tags: ["autodocs"],
    parameters: {
        layout: "centered",
    },
    argTypes: {
        variant: {
            control: "select",
            options: ["primary", "secondary", "danger", "ghost", "outline"],
        },
        size: {
            control: "select",
            options: ["sm", "md"],
        },
        onClick: { action: "clicked" },
    },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
    args: {
        children: "Save",
        variant: "primary",
        size: "medium",
    },
};

export const Danger: Story = {
    args: {
        children: "Delete",
        variant: "danger",
        size: "medium",
    },
};

export const Secondary: Story = {
    args: {
        children: "Close",
        variant: "secondary",
        size: "medium",
    },
};

export const Ghost: Story = {
    args: {
        children: "Delete all tracks",
        variant: "ghost",
        size: "medium",
    },
};

export const PlayIconView: Story = {
    args: {
        icon: (
            <PlayIcon className="[&>g>*]:fill-green-600 group-hover:[&>g>*]:fill-green-700" />
        ),
        variant: "outline",
        className: "[&>g>*]:fill-green-600 group-hover:[&>g>*]:fill-green-700",
    },
};

export const PauseIconView: Story = {
    args: {
        icon: (
            <PauseIcon className="[&>path]:fill-green-600 group-hover:[&>path]:fill-green-700" />
        ),
        variant: "outline",
        className: "[&>g>*]:fill-green-600 group-hover:[&>g>*]:fill-green-700",
    },
};

export const CloseButton: Story = {
    args: {
        icon: <CloseIcon className="w-7 h-7 [&>*]:fill-gray-700" />,
        variant: "outline",
    },
};

