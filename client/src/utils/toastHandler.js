import toast from "react-hot-toast";

export const showSuccessToast = (message) => {
  toast.success(message || "Success");
};

export const showErrorToast = (error) => {
  const message =
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong";

  toast.error(message);
};