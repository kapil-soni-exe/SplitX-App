const mongoose = require("mongoose");

const lastExpenseSchema = new mongoose.Schema(
  {
    expenseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Expense",
    },
    title: {
      type: String,
      trim: true,
    },
    amount: {
      type: Number,
    },
    createdBy: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      name: String,
    },

    paidBy: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      name: String,
    },

    createdAt: {
      type: Date,
    },
  },
  { _id: false },
);

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    inviteCode: {
      type: String,
      unique: true,
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    currency: {
      type: String,
      default: "INR",
    },
    lastExpense: lastExpenseSchema,

    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const groupModel = mongoose.model("Group", groupSchema);

module.exports = groupModel;
