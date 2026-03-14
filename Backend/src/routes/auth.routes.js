const express = require("express")
const router = express.Router()
const {register,Login,logout,refresh, verifyEmail, resendOtp,me,updateFcmToken}= require("../controller/auth.controller")
const Protected = require("../../middleware/auth.middleware")

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

// Resend OTP
router.post("/resend-otp", resendOtp)

// Get Auth/me
router.get("/me",Protected,me)

// FCM TOKEN
router.patch("/fcm-token", Protected , updateFcmToken);



module.exports = router
