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

export const CheckInviteCode =(inviteCode)=>{
  return apiClient.get(`/groups/invite/${inviteCode}`)
}

export const joinGroupByInvite = (inviteCode) => {
  return apiClient.post(`/groups/join/${inviteCode}`);
};
export const leaveGroup=(groupId)=>{
 return apiClient.post(`/groups/${groupId}/leave`)
}
