import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from "react";

interface MultiDeleteContextType {
    selectedToDeleteTracks: string[];
    setSelectedToDeleteTracks: Dispatch<SetStateAction<string[]>>;
}

const DeleteTracksContext = createContext<MultiDeleteContextType | undefined>(undefined);

export const DeleteTracksProvider = ({ children }: { children: ReactNode }) => {
    const [selectedToDeleteTracks, setSelectedToDeleteTracks] = useState<string[]>([]);

    return (
        <DeleteTracksContext.Provider value={{ selectedToDeleteTracks, setSelectedToDeleteTracks }}>
            {children}
        </DeleteTracksContext.Provider>
    );
};

export const useDeleteTracks = () => {
    const context = useContext(DeleteTracksContext);
    if (!context) throw new Error("useDeleteTracks must be used within DeleteTracksProvider");
    return context;
};
