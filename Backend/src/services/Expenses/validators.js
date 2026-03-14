const Group = require("../../models/group.model");

const validateGroupAndMembers = async ({
  groupId,
  splitBetween,
  paidBy,
}) => {
  const group = await Group.findById(groupId);

  if (!group) {
    throw Object.assign(new Error("Group not found"), {
      statusCode: 404,
    });
  }

  /**
   * Extract userIds from group members
   * members now have structure:
   * { userId, joinedAt }
   */
  const groupMemberIds = group.members.map((m) =>
    m.userId.toString()
  );

  // At least 2 members required for split
  if (!splitBetween || splitBetween.length < 2) {
    throw Object.assign(
      new Error("Expense must be split between at least 2 members"),
      { statusCode: 400 }
    );
  }

  // Validate each split member
  for (const memberId of splitBetween) {
    if (!groupMemberIds.includes(memberId.toString())) {
      throw Object.assign(
        new Error("Split member does not belong to this group"),
        { statusCode: 400 }
      );
    }
  }

  // Validate paidBy user
  if (!groupMemberIds.includes(paidBy.toString())) {
    throw Object.assign(
      new Error("PaidBy user does not belong to this group"),
      { statusCode: 400 }
    );
  }

  return group;
};

module.exports = { validateGroupAndMembers };