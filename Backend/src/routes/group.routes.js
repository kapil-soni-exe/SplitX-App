const express = require("express")
const router = express.Router()
const Protected = require("../../middleware/auth.middleware")

const {createGroup,getAllgroup,getGroupbyId} = require("../controller/group.controller")

// Create Group
router.post("/",Protected,createGroup)

// FetchAllGroup
router.get("/",Protected,getAllgroup)

// Fetch Group by Id
router.get("/:groupId",Protected,getGroupbyId)




module.exports =router