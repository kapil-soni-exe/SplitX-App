const express = require("express")
const router = express.Router()

const {createGroup,getAllgroup} = require("../controller/group.controller")

// Create Group
router.post("/",createGroup)

// FetchAllGroup
router.get("/",getAllgroup)




module.exports =router