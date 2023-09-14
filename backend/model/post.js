const mongoose=require("mongoose");

const postSchema= new mongoose.Schema({
     userId:{
      type: mongoose.Schema.Types.ObjectId,
      ref:"User",
        required:true
     },
     desc:{
        type:String,
        max:500,
        default:''
     },
     hashtag:{
      type:Array,
      default:[]
     },
     imageType:{
      type:String,
      required:true
     },
     img:{
        type:String,
        required:true
     },
     location:{
      type:String,
      default:''
     },
     report:{
         type:Boolean,
         deafult:false
     },
     reason:{
      type:[String],
      enum: ["Spam", "Inappropriate Content", "Harassment", "Violence"],
      default: [],
     },
     block:{
      type:Boolean,
      default:false,

     },
     likes: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
      ref: "User"
    }

}
,
{
    timestamps:true
})

module.exports=mongoose.model("Post",postSchema);