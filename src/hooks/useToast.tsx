import { toast, type ToastOptions, type TypeOptions } from "react-toastify";

export const useToast = () => {
    const showToast = (message: string, type: TypeOptions = "default", options?: ToastOptions) => {
        toast(<span data-testid={`toast-${type}`}>{message}</span>, {
            type,
            ...options,
        });
    };

    return { showToast };
};
