import { useState } from "react";
import DropdownMenu from "../src/components/DropdownMenu";

export default function DropdownMenuWrapper() {
    const [visible, setVisible] = useState(true);

    if (!visible) {
        return <div data-testid="menu-hidden">Menu closed</div>;
    }

    return (
        <DropdownMenu
            track={{
                id: "id",
                title: "",
                artist: "",
                album: "",
                genres: [],
                slug: "",
                coverImage: "",
                createdAt: "",
                updatedAt: "",
            }}
            setShowMenu={setVisible}
            openEditModal={() => console.log("Edit clicked")}
            openDeleteModal={() => {}}
            openUploadModal={() => {}}
        />
    );
}

