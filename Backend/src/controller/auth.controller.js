const User = require("../models/users.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const signToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
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
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
    });

    const token = signToken(user._id);

    // In Production we Add Cookies option
    res.cookie("jwt_token", token);

    res.status(201).json({
      message: "User Created",
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

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }
    const token = signToken(user._id);

    // WE Modifiy later, adding some cookies option
    res.cookie("jwt_token",token)

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
  res.cookie("jwt_token", "", { expires: new Date(0) });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};


module.exports = {register,Login,logout};
