const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    postId: {
      type: String,
      required: true
    },
    comments: [{
      name: {
        type: String,
      }, 
      comment:{
        type:String,
      }
    }]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Comment", CommentSchema);
