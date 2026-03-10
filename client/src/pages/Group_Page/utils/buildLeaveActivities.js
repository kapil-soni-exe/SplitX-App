export function buildLeaveActivities(group) {
  if (!group?.activities) return [];

  return group.activities
    .filter((a) => a.type === "GROUP_LEAVE")
    .map((a) => ({
      _id: `leave-${a.userId}-${a.createdAt}`,
      type: "LEAVE",
      user: {
        name: a.userName
      },
      createdAt: a.createdAt
    }));
}