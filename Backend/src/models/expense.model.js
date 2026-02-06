const mongoose = require("mongoose")

const splitSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // used when splitType === "EXACT"
    amount: {
      type: Number,
      min: 0,
    },

    // used when splitType === "PERCENT"
    percent: {
      type: Number,
      min: 0,
      max: 100,
    },
  },
  { _id: false }
);

const expenseSchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    note: String,

    amount: {
      type: Number,
      required: true,
      min: 1, // paise
    },

    currency: {
      type: String,
      default: "INR",
    },

    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    splitType: {
      type: String,
      enum: ["EQUAL", "EXACT", "PERCENT"],
      default: "EQUAL",
    },

    splits: {
      type: [splitSchema],
      required: true,
    },

    expenseDate: {
      type: Date,
      required: true,
    },

    category: String,

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // used when someone pays back
    isSettlement: {
      type: Boolean,
      default: false,
      index: true,
    },

    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);

const Expense = mongoose.model(
  "Expense",
  expenseSchema
);

module.exports = Expense