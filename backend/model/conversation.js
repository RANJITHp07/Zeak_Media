const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  members: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
    ref: "User",
  },

  latestMessage: {
    type: String,
  },
}, {
  timestamps: true 
});

module.exports = mongoose.model("Conversation", conversationSchema);
