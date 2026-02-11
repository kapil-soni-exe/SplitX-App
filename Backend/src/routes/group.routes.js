const express = require("express")
const router = express.Router()
const Protected = require("../../middleware/auth.middleware")

const {createGroup,getAllgroup} = require("../controller/group.controller")

// Create Group
router.post("/",Protected,createGroup)

// FetchAllGroup
router.get("/",Protected,getAllgroup)




module.exports =router