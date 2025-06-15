import z from "zod";
import { genresResponseSchema } from "../schemas/schemas";
import { R } from "@mobily/ts-belt";
import { api } from "./axios";
import { API_ROUTES } from "../constants";
import { normalizeError } from "../utils/utils";

export const getGenres = async (): Promise<
    R.Result<z.infer<typeof genresResponseSchema>, Error>
> => {
    const result = await R.fromPromise(api.get(API_ROUTES.GENRES));
    if (R.isError(result)) {
        return R.Error(normalizeError(result._0));
    }

    const parsed = genresResponseSchema.safeParse(result._0.data);

    return parsed.success
        ? R.Ok(parsed.data)
        : R.Error(new Error("Invalid genre data"));
};
