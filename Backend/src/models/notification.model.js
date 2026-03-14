const mongoose = require( "mongoose");

const notificationSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  title: {
    type: String,
    required: true
  },

  message: {
    type: String,
    required: true
  },

  type: {
    type: String,
    enum: ["expense", "settlement", "reminder", "group"],
    required: true
  },

  isRead: {
    type: Boolean,
    default: false
  },

  metadata: {
    expenseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Expense"
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group"
    }
  }

}, { timestamps: true });

notificationSchema.index({ user: 1, createdAt: -1 });

const notificationModel = mongoose.model("Notification", notificationSchema);
module.exports = notificationModel