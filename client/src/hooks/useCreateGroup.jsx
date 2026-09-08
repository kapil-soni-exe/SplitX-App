import { createGroup, fetchGroups } from "../../api/group.api";

export const useCreateGroup = () => {
  const create = async (name) => {
    try {
      const res = await createGroup({ name });
      const group = res.data.data;
      const inviteLink = `${window.location.origin}/invite/${group.inviteCode}`;

      return {
        success: true,
        group,
        inviteLink,
        message: res.data.message,
      };
    } catch (error) {
      console.error("Create group error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to create group",
      };
    }
  };

  return { create };
};

export const useGroups = () => {
  const getGroups = async () => {
    try {
      const res = await fetchGroups();
      return {
        success: true,
        data: res.data.data,
      };
    } catch (error) {
      console.error("Fetch groups error:", error);
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || "Failed to fetch groups",
      };
    }
  };

  return { getGroups };
};