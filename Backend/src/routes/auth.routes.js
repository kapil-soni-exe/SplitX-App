const express = require("express")
const router = express.Router()
const {register,Login,logout,refresh, verifyEmail}= require("../controller/auth.controller")


// register
router.post("/register",register)

// Login
router.post("/login",Login)
// Logout
router.post("/logout",logout)

// Refresh Endpoint
router.post("/refresh",refresh)

// Verify-Email
router.post("/verify-email",verifyEmail)



module.exports = router
