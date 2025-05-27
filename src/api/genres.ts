import { api } from "./axios";

export const getGenres = async () => {
    const res = await api.get<string[]>("/genres");
    return res.data;
};
