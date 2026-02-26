import apiClient from "./apiClient"

export const createExpense = (data) => {
  return apiClient.post("/expenses", data);
};

export const fetchExpensesByGroup = (groupId) => {
  return apiClient.get(`/expenses?groupId=${groupId}`);
};