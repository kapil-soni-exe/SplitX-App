const express = require("express")
const router = express.Router()
const {register,Login}= require("../controller/auth.controller")


// register
router.post("/register",register)
router.get("/login",Login)



module.exports = router
