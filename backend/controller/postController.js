const crypto = require('crypto')
const Post=require('../model/post')
const { S3Client, PutObjectCommand,GetObjectCommand }=require("@aws-sdk/client-s3")
const { getSignedUrl } =require("@aws-sdk/s3-request-presigner")
const dotenv=require('dotenv')
const User=require("../model/user")

dotenv.config();

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY



let s3Client
if(bucketName && region && accessKeyId && secretAccessKey){
  
  s3Client = new S3Client({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey
    }
  })

}

const newPost=async (req, res,next) => {


  const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')
  const imageName = generateFileName();
  const body=JSON.parse(req.body.data)
  const file=req.file
  
  

  const uploadParams = {
    Bucket: bucketName,
    Body: file.buffer,
    Key: imageName,
    ContentType: file.mimetype
  }
  await s3Client.send(new PutObjectCommand(uploadParams));


 

  const post={
    userId:body.userId,
    img:imageName,
    desc: body.desc,
    hashtag: body.hastag,
    location:body.location,
    imageType:body.imageType
  }
    const newPost = new Post(
       post
    );
    try {
      const savedPost = await newPost.save();
      res.status(200).json(savedPost);
    } catch (err) {
      next(err)
    }
  }

const updatePost=async (req, res,next)=>{
 
        try {
          const post = await Post.findById(req.params.id);
          if (post.userId === req.body.userId) {
            await post.updateOne({ $set: req.body });
            res.status(200).json("the post has been updated");
          } else {
            res.status(403).json("you can update only your post");
          }
        } catch (err) {
          next(err)
        }
    }
  
 const deletePost=async(req, res,next)=>{
  try {
    const post = await Post.findById(req.params.id);
    console.log(req.query.userId,post.userId)
    if (post.userId == req.query.userId) {
      await Post.findByIdAndDelete(req.params.id);
      res.status(200).json("the post has been deleted");
    } else {
      res.status(200).json("you can delete only your post");
    }
  } catch (err) {
    next(err)
  }
 }   

 const likePost=async (req, res,next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("The post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The post has been disliked");
    }
  } catch (err) {
    next(err)
  }
}

const getPost=async (req, res,next) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    next(err)
  }
}

const getAllPosts=async (req, res,next) => {
  try {
    const currentUser = await User.findById({_id:req.params.userId});
    const userPosts = await Post.find({ userId: currentUser._id }).populate('userId').sort({createdAt:-1});
    const friendPosts = await Promise.all(
      currentUser.following.map((friendId) => {
        return Post.find({ userId: friendId }).populate('userId').sort({createdAt:-1});
      })
    )
     const allPosts = [userPosts, ...friendPosts].flat();

     allPosts.sort((a, b) => b.createdAt - a.createdAt);
 
     res.status(200).json(allPosts);
  } catch (err) {
    console.log(err)
    next(err)
  }
}

const getUserPost=async (req, res,next) => {
  try {
    const posts = await Post.find({ userId:req.params.id }).populate('userId').sort({createdAt:-1});
    res.status(200).json(posts);
  } catch (err) {
    next(err)
  }
}

const getPosturl=async(req, res,next)=>{
  console.log(req.query.imageName)
  try{
    if(req.query.imageName){
      const params = {
        Bucket: bucketName,
        Key: req.query.imageName
      }
      const command = new GetObjectCommand(params);
      const url = await getSignedUrl(s3Client, command, { expiresIn: 60 * 60 * 24 * 7 }); 
      res.status(200).json(url);
      console.log("Hii")
    }
    
  
  }catch(err){
    next(err)
  }
}

const report=async(req,res,next)=>{
  try{
    console.log(req.body)
    const user = await Post.findByIdAndUpdate(
      req.body.id,
      {
        $set: { report: true },
      },
      { new: true }
    );
    

    if(!user.reason.includes(req.body.reason)){

      await Post.findByIdAndUpdate(
        req.body.id,
        {
          $set: { report: true },
          $push:{reason:req.body.reason}
        },
        { new: true }
      );
  
    }
    res.status(200).json("Reported")
    

  }catch(err){
    next(err)
  }
}

const getSavedPost=async(req,res,next)=>{
  try{
    console.log(req.query.userId)
      const savedPosts=await Post.find({_id:{$in:req.query.userId}}).populate("userId")
      console.log(savedPosts)
      res.status(200).json(savedPosts)
  }catch(err){
    next(err)
  }
}

const getReportedPost=async(req,res,next)=>{
   try{
       const post=await Post.find({report:true,block:false}).populate("userId");
       res.status(200).json(post)
   }catch(err){
    next(err)
   }
}

const blockPost=async(req,res,next)=>{
  try{
      await Post.findByIdAndUpdate(req.params.id,{$set:{block:true}})
      res.status(200).json("The post is blocked")
  }catch(err){
    next(err)
  }
}


  module.exports={
    newPost,
    updatePost,
    deletePost,
    likePost,
    getPost,
    getAllPosts,
    getUserPost,
    getPosturl,
    getSavedPost,
    report,
    getReportedPost,
    blockPost
  }