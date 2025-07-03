import { toast, type ToastOptions, type TypeOptions } from "react-toastify";

type ShowToastFn = (
    message: string,
    type?: TypeOptions,
    options?: ToastOptions
) => void;

export const useToast = (): { showToast: ShowToastFn } => {
    const showToast: ShowToastFn = (
        message: string,
        type: TypeOptions = "default",
        options?: ToastOptions
    ) => {
        toast(<span data-testid={`toast-${type}`}>{message}</span>, {
            type,
            ...options,
        });
    };

    return { showToast };
};
