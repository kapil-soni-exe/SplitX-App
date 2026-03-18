const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    avatar: {
      type: String, // image URL
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    refreshToken: String,

    fcmToken: {
    type: String,
    default: null
  }
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
  },
);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
