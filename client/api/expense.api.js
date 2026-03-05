import apiClient from "./apiClient"

export const createExpense = (data) => {
  return apiClient.post("/expenses", data);
};

export const fetchExpensesByGroup = (groupId) => {
  return apiClient.get(`/expenses?groupId=${groupId}`);
};

//  Edit expense
export const updateExpense = (expenseId, data) => {
  return apiClient.patch(`/expenses/${expenseId}`, data);
};

// Delete Expense(Soft delete)
export const deleteExpense =(expenseId)=>{
  return apiClient.delete(`/expenses/${expenseId}`)
}