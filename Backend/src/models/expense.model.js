const mongoose = require("mongoose");

const splitSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // only used when splitType === "UNEQUAL"
    amount: {
      type: Number,
    },
  },
  { _id: false },
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

    note: {
      type: String,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    splitType: {
      type: String,
      enum: ["EQUAL", "EXACT"],
      required: true,
    },

    splits: {
      type: [splitSchema],
      required: true,
      validate: [(v) => v.length > 0, "At least one split is required"],
    },

    expenseDate: {
      type: Date,
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

     deletedAt: {
      type: Date,
      default: null,
    },

    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    editedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

expenseSchema.index({ groupId: 1, deletedAt: 1 });

module.exports = mongoose.model("Expense", expenseSchema);
