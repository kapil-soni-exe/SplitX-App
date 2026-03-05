/**
 * buildJoinActivities
 * -------------------
 * Converts group member join events
 * into timeline activity objects
 */

export function buildJoinActivities(group) {
  if (!group || !group.members) return [];

  return group.members
    .filter(
      (m) =>
        new Date(m.joinedAt) >
        new Date(group.createdAt)
    )
    .map((m) => ({
      _id: `join-${m.userId._id}`,
      type: "JOIN",
      user: m.userId,
      createdAt: m.joinedAt,
    }));
}