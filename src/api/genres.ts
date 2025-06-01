import z from "zod";
import { genresResponseSchema } from "../schemas/schemas";
import { Result, ok, err } from "neverthrow";
import { api } from "./axios";

export const getGenres = async (): Promise<
    Result<z.infer<typeof genresResponseSchema>, Error>
> => {
    try {
        const res = await api.get("/genres");
        return ok(genresResponseSchema.parse(res.data));
    } catch (e) {
        return err(e instanceof Error ? e : new Error("Unknown error"));
    }
};
