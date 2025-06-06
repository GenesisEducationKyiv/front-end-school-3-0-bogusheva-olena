import z from "zod";
import { genresResponseSchema } from "../schemas/schemas";
import { Result, ok, err } from "neverthrow";
import { api } from "./axios";
import { API_ROUTES } from "../constants";
import { normalizeError } from "../utils/utils";

export const getGenres = async (): Promise<
    Result<z.infer<typeof genresResponseSchema>, Error>
> => {
    try {
        const res = await api.get(API_ROUTES.GENRES);
        return ok(genresResponseSchema.parse(res.data));
    } catch (e) {
        return err(normalizeError(e));
    }
};
