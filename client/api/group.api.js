import apiClient from "./apiClient";

export const createGroup = (payload) => {
  return apiClient.post("/groups", payload);
};

export const fetchGroups = () => {
  return apiClient.get("/groups");
};

export const FetchGroupbyId=(groupId)=>{
  return apiClient.get(`/groups/${groupId}`)
}
