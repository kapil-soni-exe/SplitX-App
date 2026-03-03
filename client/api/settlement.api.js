import apiClient from "./apiClient";

// Create settlement
export const createSettlement = (groupId, payload) => {
  return apiClient.post(`/groups/${groupId}/settlements`, payload);
};

// Get settlement history
export const fetchGroupSettlements = (groupId) => {
  return apiClient.get(`/groups/${groupId}/settlements`);
};