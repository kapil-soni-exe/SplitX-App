const User = require("../models/users.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const {
  sendOtpEmail,
  sendVerifySuccessEmail,
} = require("../services/email.service");

const signToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "15m" });
};

// RefreshToken
const signRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

//Register

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields required!",
      });
    }
    // Already User
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }
    // Password Hashed
    const hashed = await bcrypt.hash(password, 10);

    // Otp generate
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpHashed = await bcrypt.hash(otp, 10);

    // User Create
    const user = await User.create({
      name,
      email,
      password: hashed,
      isVerified: false,
      emailOtpHash: otpHashed,
      emailOtpExpiresAt: Date.now() + 10 * 60 * 1000,
    });

    // Sending Email for verification
    await sendOtpEmail({
      to: email,
      otp,
    });

    return res.status(201).json({
      message: "OTP sent to email",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN
const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Missing credentials",
      });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Password Check
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Check email is verified or not
    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email first",
      });
    }
    const accessToken = signToken(user._id);

    const refreshToken = signRefreshToken(user._id);
    const refreshHash = await bcrypt.hash(refreshToken, 10);

    user.refreshToken = refreshHash;
    await user.save();

    // WE Modifiy later, adding some cookies option

    res.cookie("jwt_token", accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// LOGOUT

const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refresh_token;

    // clear both cookies
    res.clearCookie("jwt_token");
    res.clearCookie("refresh_token");

    // if no refresh token, just logout client-side
    if (!refreshToken) {
      return res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    }

    //  If token exits then remove it from DB
    let decoded;
    if (refreshToken) {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    }
    const user = await User.findById(decoded.id);

    if (user) {
      user.refreshToken = null;
      await user.save();
    }

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (err) {
    console.log(err);
    // even if error, cookies clear
    res.clearCookie("jwt_token");
    res.clearCookie("refresh_token");

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  }
};

// Refresh Token
const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token" });
    }

    // verify refresh token signature + expiry
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // find user
    const user = await User.findById(decoded.id);

    if (!user || !user.refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    // compare hashed token in DB
    const match = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!match) {
      return res.status(403).json({ message: "Token mismatch" });
    }

    // generate new access token
    const newAccessToken = signToken(user._id);

    // update cookie
    res.cookie("jwt_token", newAccessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Access token refreshed",
    });
  } catch (err) {
    console.log(err);
    return res.status(403).json({
      message: "Refresh token expired or invalid",
    });
  }
};

// Verify Email
const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        message: "Email already verified",
      });
    }

    if (Date.now() > user.emailOtpExpiresAt) {
      return res.status(400).json({
        message: "OTP expired",
      });
    }
    const match = await bcrypt.compare(otp, user.emailOtpHash);

    if (!match) {
      user.emailOtpAttempts += 1;
      await user.save();

      return res.status(400).json({
        message: "Invalid OTP",
      });
    }
    //  OTP correct
    user.isVerified = true;
    user.emailOtpHash = undefined;
    user.emailOtpExpiresAt = undefined;
    user.emailOtpAttempts = 0;

    await user.save();

    await sendVerifySuccessEmail({
      to: user.email,
      name: user.name,
    });

    return res.status(200).json({
      message: "Email verified successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

// Resend Otp
const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    const NOW = Date.now();
    const COOLDOWN = 60 * 1000; // 60 sec

    // cooldown check
    if (user.otpLastSentAt) {
      const diff = NOW - new Date(user.otpLastSentAt).getTime();
      if (diff < COOLDOWN) {
        const wait = Math.ceil((COOLDOWN - diff) / 1000);
        return res.status(429).json({
          message: `Please wait ${wait}s before resending OTP`,
        });
      }
    }
    // 24h window check
    if (!user.otpResendWindowStart) {
      user.otpResendWindowStart = NOW;
      user.otpResendCount = 0;
    }

    const hoursPassed =
      (NOW - new Date(user.otpResendWindowStart).getTime()) / (1000 * 60 * 60);

    if (hoursPassed >= 24) {
      user.otpResendCount = 0;
      user.otpResendWindowStart = NOW;
    }

    // limit reached
    if (user.otpResendCount >= 3) {
      return res.status(429).json({
        message: "Resend limit reached. Try again after 24 hours.",
      });
    }
    //  generate new OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpHash = await bcrypt.hash(otp, 10);

    user.emailOtpHash = otpHash;
    user.emailOtpExpiresAt = NOW + 10 * 60 * 1000;
    user.emailOtpAttempts = 0;
    user.otpLastSentAt = NOW;
    user.otpResendCount += 1;

    await user.save();

    // email send
    await sendOtpEmail({ to: email, otp });

    return res.status(200).json({
      message: "OTP resent successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /auth/me
 *
 * Purpose:
 * - Returns the currently authenticated user's basic info
 * - Used by frontend to restore auth state on page refresh
 */

const me = async (req, res) => {
  try {
    const user = req.user;

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user session",
    });
  }
};

module.exports = { register, Login, logout, refresh, verifyEmail, resendOtp,me };
