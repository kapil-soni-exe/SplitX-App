import apiClient from "./apiClient";

export const loginUser = (data) => {
  return apiClient.post("/auth/login", data);
};
export const registerUser = (data) => {
  return apiClient.post("/auth/register", data);
};
export const verifyEmailOtp = (data) => {
  return apiClient.post("/auth/verify-email", data);
};

export const resendOtp = (data) => {
  return apiClient.post("/auth/resend-otp", data);
};
export const logoutUser = () => {
  return apiClient.post("/auth/logout");
};
