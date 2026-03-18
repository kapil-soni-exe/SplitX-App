const express = require("express")
const router = express.Router()
const {register,Login,logout,refresh,me,updateFcmToken}= require("../controller/auth.controller")
const Protected = require("../../middleware/auth.middleware")

// register
router.post("/register",register)

// Login
router.post("/login",Login)
// Logout
router.post("/logout",logout)

// Refresh Endpoint
router.post("/refresh",refresh)

// Get Auth/me
router.get("/me",Protected,me)

// FCM TOKEN
router.patch("/fcm-token", Protected , updateFcmToken);



module.exports = router
