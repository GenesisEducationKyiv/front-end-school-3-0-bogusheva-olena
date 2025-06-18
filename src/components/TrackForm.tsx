import { FormikErrors, FormikHelpers, useFormik } from "formik";

import Loader from "../ui/Loader";

import CloseIcon from "../assets/icons/close.svg?react";
import { Track, TrackFormValues } from "../types";
import { trackFormSchema } from "../schemas/schemas";

interface Props {
    genres: string[];
    closeModal: () => void;
    isLoading: boolean;
    onSubmit: (
        values: TrackFormValues,
        formikHelpers: FormikHelpers<TrackFormValues>,
    ) => void;
    track?: Track;
}

export default function TrackForm({
    genres,
    closeModal,
    onSubmit,
    isLoading,
    track,
}: Props) {
    const formik = useFormik<TrackFormValues>({
        initialValues: {
            title: track?.title || "",
            artist: track?.artist || "",
            album: track?.album || "",
            genres: track?.genres || [],
            coverImage: track?.coverImage || "",
        },
        enableReinitialize: true,
        validate: (values) => {
            const result = trackFormSchema.safeParse(values);
            if (result.success) return {};

            const fieldErrors = result.error.flatten().fieldErrors;

            const formikErrors: FormikErrors<TrackFormValues> =
                Object.fromEntries(
                    Object.entries(fieldErrors).map(([key, val]) => [
                        key,
                        val?.[0],
                    ]),
                );

            return formikErrors;
        },
        onSubmit,
    });

    const addGenre = (genre: string) => {
        if (!formik.values.genres.includes(genre)) {
            formik.setFieldValue("genres", [...formik.values.genres, genre]);
        }
    };

    const removeGenre = (genre: string) => {
        formik.setFieldValue(
            "genres",
            formik.values.genres.filter((g) => g !== genre),
        );
    };
    return (
        <form onSubmit={formik.handleSubmit} data-testid="track-form">
            <div className="mb-4">
                <label htmlFor="title" className="font-semibold">
                    Title
                </label>
                <input
                    id="title"
                    name="title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full border p-2 rounded"
                    data-testid="input-title"
                />
                {formik.touched.title && formik.errors.title && (
                    <p
                        className="text-red-500 text-sm"
                        data-testid="error-title"
                    >
                        {formik.errors.title}
                    </p>
                )}
            </div>
            <div className="mb-4">
                <label htmlFor="artist" className="font-semibold">
                    Artist
                </label>
                <input
                    id="artist"
                    name="artist"
                    value={formik.values.artist}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full border p-2 rounded"
                    data-testid="input-artist"
                />
                {formik.touched.artist && formik.errors.artist && (
                    <p
                        className="text-red-500 text-sm"
                        data-testid="error-artist"
                    >
                        {formik.errors.artist}
                    </p>
                )}
            </div>
            <div className="mb-4">
                <label htmlFor="album" className="font-semibold">
                    Album
                </label>
                <input
                    id="album"
                    name="album"
                    value={formik.values.album}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full border p-2 rounded"
                    data-testid="input-album"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="coverImage" className="font-semibold">
                    Cover Image URL
                </label>
                <input
                    id="coverImage"
                    name="coverImage"
                    value={formik.values.coverImage}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full border p-2 rounded"
                    data-testid="input-cover-image"
                />
                {formik.errors.coverImage && (
                    <p
                        className="text-red-500 text-sm"
                        data-testid="error-coverImage"
                    >
                        {formik.errors.coverImage}
                    </p>
                )}
            </div>
            <div className="mb-4">
                <label className="font-semibold">Genres</label>
                <div
                    className="flex flex-wrap gap-2 mt-2"
                    data-testid="genre-selector"
                >
                    {formik.values.genres.map((genre) => (
                        <span
                            key={genre}
                            className="bg-green-100 text-green-700 px-2 py-1 gap-x-1 rounded flex items-center"
                        >
                            {genre}
                            <button
                                type="button"
                                onClick={() => removeGenre(genre)}
                                className="text-red-500"
                                aria-label="Delete genre"
                            >
                                <CloseIcon className="w-4 h-4" />
                            </button>
                        </span>
                    ))}
                </div>
                {formik.touched.genres && formik.errors.genres && (
                    <p
                        className="text-red-500 text-sm"
                        data-testid="error-genres"
                    >
                        {formik.errors.genres}
                    </p>
                )}
                <div className="mt-2 flex gap-2 flex-wrap">
                    {genres
                        .filter((g) => !formik.values.genres.includes(g))
                        .map((genre) => (
                            <button
                                type="button"
                                key={genre}
                                onClick={() => addGenre(genre)}
                                className="px-2 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
                            >
                                + {genre}
                            </button>
                        ))}
                </div>
            </div>
            <div className="flex gap-x-2">
                <button
                    type="submit"
                    disabled={isLoading}
                    aria-disabled={isLoading}
                    data-loading={isLoading || undefined}
                    className="flex bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    data-testid="submit-button"
                >
                    {isLoading && <Loader className="mr-2 [&>*]:fill-white" />}
                    Save
                </button>
                <button
                    type="button"
                    onClick={closeModal}
                    className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                    data-testid="close-button"
                >
                    Close
                </button>
            </div>
        </form>
    );
}
