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
      default: false,
    },
    emailOtpHash: {
      type: String,
    },
    emailOtpExpiresAt: {
      type: Date,
    },
    emailOtpAttempts: {
      type: Number,
      default: 0,
    },

    otpLastSentAt: {
      type: Date,
    },

    otpResendCount: {
      type: Number,
      default: 0,
    },

    otpResendWindowStart: {
      type: Date,
    },

    refreshToken: String,
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
  },
);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
