const express = require("express")
const router = express.Router()
const Protected = require("../../middleware/auth.middleware")

const {createGroup,getAllgroup,getGroupbyId, CheckInviteCode, joinGroup} = require("../controller/group.controller")

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



module.exports =router