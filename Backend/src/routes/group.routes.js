const express = require("express")
const router = express.Router()
const Protected = require("../../middleware/auth.middleware")

const {createGroup,getAllgroup,getGroupbyId, CheckInviteCode, joinGroup, leaveGroup} = require("../controller/group.controller")

// Create Group
router.post("/", Protected, createGroup)

// FetchAllGroup
router.get("/", Protected, getAllgroup)

// Check Invite Code — must be BEFORE /:groupId to avoid "invite" being treated as a groupId
router.get("/invite/:inviteCode", CheckInviteCode)

// JoinGroupByInviteCode — must be BEFORE /:groupId
router.post("/join/:inviteCode", Protected, joinGroup)

// Fetch Group by Id
router.get("/:groupId", Protected, getGroupbyId)

// Leave The Group
router.post("/:groupId/leave", Protected, leaveGroup);



module.exports =router