import { BASE_URL } from "./main";

export const FILE_PATH = `${BASE_URL}/files/`;

export const VALID_FILE_TYPE = ["audio/mpeg", "audio/wav", "audio/mp3"];

export const FILE_MAX_SIZE = 10 * 1024 * 1024;

export const FILE_ERRORS = {
    INVALID_TYPE: "Only MP3 or WAV files are allowed.",
    TOO_LARGE: "File size must be less than 10MB.",
};
