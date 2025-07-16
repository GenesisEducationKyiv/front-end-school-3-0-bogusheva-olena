import { type Meta, type StoryObj } from "@storybook/react";
import Loader from "./Loader";

const meta: Meta<typeof Loader> = {
    title: "UI/Loader",
    component: Loader,
    tags: ["autodocs"],
    parameters: {
        layout: "centered",
    },
    argTypes: {
        variant: {
            control: "select",
            options: ["dark", "light"],
        },
        size: {
            control: "select",
            options: ["small", "medium", "large"],
        },
    },
};

export default meta;
type Story = StoryObj<typeof Loader>;

export const InBtnLight: Story = {
    render: (args) => (
        <div className="px-2 py-1 rounded flex items-center gap-x-2 bg-green-600 text-white font-semibold ">
            <Loader {...args} />
            Save
        </div>
    ),
    args: {
        variant: "light",
        size: "small",
    },
};
export const InBtnDark: Story = {
    render: (args) => (
        <div className="px-2 py-1 rounded flex items-center gap-x-2 text-black font-semibold border border-gray-600 bg-white">
            <Loader {...args} />
            Save
        </div>
    ),
    args: {
        variant: "dark",
        size: "small",
    },
};

export const Standalone: Story = {
    render: (args) => (
        <div className="border bg-black rounded-xl w-[300px] h-[300px] flex items-center justify-center">
            <Loader {...args} />
        </div>
    ),
    args: {
        variant: "light",
        size: "large",
    },
};

