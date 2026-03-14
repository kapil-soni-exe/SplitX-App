import apiClient from "../api/apiClient";

/**
 * Update user's FCM token
 * Called after Firebase generates token
 */

export const updateFcmToken = async (token) => {
  try {

    const response = await apiClient.patch("/auth/fcm-token", {
      token
    });

    return response.data;

  } catch (error) {

    console.error("FCM token update failed:", error);

    throw error;
  }
};