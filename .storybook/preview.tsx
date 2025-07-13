import type { Preview } from "@storybook/react-vite";
import "../src/index.css";
import { useEffect } from "react";

function WithModalContainer({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        const existing = document.getElementById("modals");
        if (!existing) {
            const div = document.createElement("div");
            div.id = "modals";
            document.body.appendChild(div);
        }
    }, []);

    return <>{children}</>;
}

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        a11y: {
            test: "todo",
        },
    },
    decorators: [
        (Story) => (
            <WithModalContainer>
                <Story />
            </WithModalContainer>
        ),
    ],
};

export default preview;
