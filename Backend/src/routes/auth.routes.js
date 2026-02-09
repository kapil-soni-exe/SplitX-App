const express = require("express")
const router = express.Router()
const {register,Login,logout}= require("../controller/auth.controller")


// register
router.post("/register",register)
router.post("/login",Login)
router.post("/logout",logout)



module.exports = router
