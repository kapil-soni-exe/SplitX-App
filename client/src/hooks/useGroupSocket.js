import { useEffect } from "react";
import socket from "../sockets/socket";

export const useGroupSocket = (groupId, handlers = {}) => {
  const {
    onExpenseAdded,
    onExpenseUpdated,
    onExpenseDeleted,
    onMemberJoined,
    onMemberLeft,
    onAdminChanged,
  } = handlers;

  useEffect(() => {
    if (!groupId) return;

    const joinRoom = () => {
      console.log("Joining room:", groupId);
      socket.emit("join-group", groupId);
    };

    if (socket.connected) {
      joinRoom();
    } else {
      socket.once("connect", joinRoom);
    }

    const handleAdded = (expense) => {
      onExpenseAdded?.(expense);
    };

    const handleUpdated = (expense) => {
      onExpenseUpdated?.(expense);
    };

    const handleDeleted = (data) => {
      onExpenseDeleted?.(data);
    };

    const handleMemberJoined = (data) => {
      onMemberJoined?.(data);
    };

    const handleMemberLeft = (data) => {
      onMemberLeft?.(data);
    };

 

    socket.on("expense-added", handleAdded);
    socket.on("expense-updated", handleUpdated);
    socket.on("expense-deleted", handleDeleted);
    socket.on("member-joined", handleMemberJoined);
    socket.on("member-left", handleMemberLeft);
    

    return () => {
      socket.emit("leave-group", groupId);

      socket.off("expense-added", handleAdded);
      socket.off("expense-updated", handleUpdated);
      socket.off("expense-deleted", handleDeleted);
      socket.off("member-joined", handleMemberJoined);
      socket.off("member-left", handleMemberLeft);
      
    };
  }, [groupId]);
};
