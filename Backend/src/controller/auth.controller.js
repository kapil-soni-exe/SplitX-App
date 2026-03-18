const User = require("../models/users.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

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
  console.log("Registering user:", req.body.email);
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

    // User Create
    const user = await User.create({
      name,
      email,
      password: hashed,
      isVerified: true,
    });

    return res.status(201).json({
      message: "User registered successfully",
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

    const accessToken = signToken(user._id);

    const refreshToken = signRefreshToken(user._id);
    const refreshHash = await bcrypt.hash(refreshToken, 10);

    user.refreshToken = refreshHash;
    await user.save();

    // WE Modifiy later, adding some cookies option

   res.cookie("jwt_token", accessToken, {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 15 * 60 * 1000,
});

res.cookie("refresh_token", refreshToken, {
  httpOnly: true,
  secure: true,
  sameSite: "none",
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

    // clear both cookies — must use same options as when they were set
    const cookieOpts = { httpOnly: true, secure: true, sameSite: "none" };
    res.clearCookie("jwt_token", cookieOpts);
    res.clearCookie("refresh_token", cookieOpts);

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
    // even if error, cookies clear — same options as when they were set
    const cookieOpts = { httpOnly: true, secure: true, sameSite: "none" };
    res.clearCookie("jwt_token", cookieOpts);
    res.clearCookie("refresh_token", cookieOpts);

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
  secure: true,
  sameSite: "none",
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


 const updateFcmToken = async (req, res) => {

  try {

    const userId = req.user.id;
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        message: "FCM token required"
      });
    }

    await User.findByIdAndUpdate(
      userId,
      { fcmToken: token },
      { new: true }
    );

    res.json({
      success: true,
      message: "FCM token saved"
    });

  } catch (error) {

    console.error("FCM token save error:", error);

    res.status(500).json({
      message: "Server error"
    });

  }

};

module.exports = { register, Login, logout, refresh, me, updateFcmToken };
