import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import Modal from "./Modal";
import Button from "./Button";

const meta: Meta<typeof Modal> = {
    title: "UI/Modal",
    component: Modal,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Modal>;

const WithActionsExample = () => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <>
            <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
            <Modal
                isOpened={isOpen}
                onClose={() => setIsOpen(false)}
                title="Delete track"
                name="delete-confirm"
            >
                <div className="space-y-4">
                    <p className="text-gray-700">
                        Do you want to delete the track:
                    </p>
                    <p className="font-bold pb-4">Harry Styles - As It Was</p>
                    <div className="flex gap-2">
                        <Button
                            variant="danger"
                            onClick={() => setIsOpen(false)}
                        >
                            Yes, Delete
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => setIsOpen(false)}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

const WithFormExample = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [title, setTitle] = useState("");
    const [artist, setArtist] = useState("");

    return (
        <>
            <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
            <Modal
                isOpened={isOpen}
                onClose={() => setIsOpen(false)}
                title="Create Track"
                name="create-track"
            >
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        console.log({ title, artist });
                        setIsOpen(false);
                    }}
                >
                    <div className="mb-4">
                        <label htmlFor="title" className="font-semibold">
                            Title
                        </label>
                        <input
                            id="title"
                            name="title"
                            className="w-full border p-2 rounded"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            data-testid="input-title"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="artist" className="font-semibold">
                            Artist
                        </label>
                        <input
                            id="artist"
                            name="artist"
                            className="w-full border p-2 rounded"
                            value={artist}
                            onChange={(e) => setArtist(e.target.value)}
                            data-testid="input-artist"
                        />
                    </div>
                    <div className="flex gap-2 mt-2">
                        <Button variant="primary" type="submit">
                            Save
                        </Button>
                        <Button
                            variant="secondary"
                            type="button"
                            onClick={() => setIsOpen(false)}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
};

export const WithActions: Story = {
    render: () => <WithActionsExample />,
};

export const WithForm: Story = {
    render: () => <WithFormExample />,
};
