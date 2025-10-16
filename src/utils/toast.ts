import { type ToastOptions, toast } from "react-toastify";

export const showToast = {
  success: (message: string, options?: ToastOptions) => {
    toast.success(message, options);
  },
  error: (message: string, options?: ToastOptions) => {
    toast.error(message, options);
  },
  info: (message: string, options?: ToastOptions) => {
    toast.info(message, options);
  },
  warning: (message: string, options?: ToastOptions) => {
    toast.warn(message, options);
  },
};
