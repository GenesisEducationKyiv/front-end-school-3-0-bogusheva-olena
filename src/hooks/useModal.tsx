import { useState } from "react";
import { lockScroll } from "../utils/utils";

export const useModal = () => {
    const [isModalOpened, setIsModalOpened] = useState(false);

    const openModal = () => {
        setIsModalOpened(true);
        lockScroll(true);
    };

    const closeModal = () => {
        setIsModalOpened(false);
        lockScroll(false);
    };

    return {
        isModalOpened,
        openModal,
        closeModal,
    };
};
