const Comment=require("../model/comment");


//create or push to the existing postId

const createComment=async(req,res,next)=>{
  try{
      const post=await Comment.findOne({postId:req.body.postId});
      if(post){
        await Comment.findOneAndUpdate({postId:req.body.postId},{$push:{comments:{
          name:req.body.name,
          comment:req.body.comment
        }}})
      }else{
        await Comment.create({postId:req.body.postId,comments:{
          name:req.body.name,
          comment:req.body.comment
        }})
      }
      res.status(200).json("comment created")
  }catch(err){
     next(err)
  }
}


const getAllComments=async(req,res,next)=>{
  try{
       const allcomments=await Comment.findOne({postId:req.params.id})
       res.status(200).json(allcomments)
  }catch(err){
    next(err)
  }
}

const updateComment=async(req,res,next)=>{
  try{
    const updateComment=await Comment.findOneAndUpdate({'comments._id':req.body.id},{$set:{ 'comments.$.comment':req.body.comment}},{new:true})
    res.status(200).json(updateComment)
  }catch(err){
    next(err)
  }
}


const deleteComment=async(req,res,next)=>{
  try{
    const {postId,commentId}=req.body
       await Comment.findOneAndUpdate(
      { postId },
      { $pull: { comments: { _id: commentId } } },
      { new: true } 
    );
    res.status(200).json('deleted')
  }catch(err){
    next(err)
  }
}


module.exports={
  createComment,
  getAllComments,
  updateComment,
  deleteComment
}