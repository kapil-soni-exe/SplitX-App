const express = require("express")
const router = express.Router()
const Protected = require("../../middleware/auth.middleware")

const {createGroup,getAllgroup,getGroupbyId, CheckInviteCode, joinGroup, leaveGroup} = require("../controller/group.controller")

// Create Group
router.post("/",Protected,createGroup)

// FetchAllGroup
router.get("/",Protected,getAllgroup)

// Fetch Group by Id
router.get("/:groupId",Protected,getGroupbyId)

// Check Invite Code
router.get("/invite/:inviteCode",CheckInviteCode)

// JoinGroupByInviteCode
router.post("/join/:inviteCode",Protected,joinGroup)

// Leave The Group
router.post("/:groupId/leave", Protected, leaveGroup);



module.exports =router