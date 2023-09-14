const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  userId:{
    type:String,
    required:true
  },
  name:{
    type:String,
    required:true
  },
  text:{
    type:String,
    required:true
  }
}, {
  timestamps: true 
});

module.exports = mongoose.model("Notification", conversationSchema);
