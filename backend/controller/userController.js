const crypto = require('crypto')
const User=require('../model/user')
const dotenv=require('dotenv')
const { S3Client, PutObjectCommand,GetObjectCommand }=require("@aws-sdk/client-s3")
const nodemailer=require('nodemailer')

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

const getUserProfile=async(req,res,next)=>{
    try{
      const user= await User.findOne({username:req.params.id})
      if(!user){
        const user= await User.findOne({_id:req.params.id})
        const{password,createdAt,...others}=user._doc
        res.status(201).json(others)
      }else{

        const{password,createdAt,...others}=user._doc
        console.log(others)
        res.status(201).json(others)
      }
        
    }
    catch(err){
        next(err)
    }
}

const updatePictures=async(req,res,next)=>{
    try{
        const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')
       
        const imageName = generateFileName();
        const file=req.file

        const uploadParams = {
          Bucket: bucketName,
          Body: file.buffer,
          Key: imageName,
          ContentType: file.mimetype
        }
        await s3Client.send(new PutObjectCommand(uploadParams));
      
        if(req.body.type==='background'){
        await User.findByIdAndUpdate({_id:req.params.id},{$set:{coverPicture:imageName}},{new:true})
        res.status(200).json("Cover Picture updated")
        }else{
            await User.findByIdAndUpdate({_id:req.params.id},{$set:{profilePicture:imageName}},{new:true}) 
            res.status(200).json("Profile Picture updated")
        }
    }catch(err){
        next(err)
    }
}


const updateProfile=async function(req,res,next){
  try{
      const update=await User.findByIdAndUpdate(req.params.id,{$set:req.body.update},{new:true})
      res.status(200).json("Profile Updated")
  }
  catch(err){
      next(err)
     }
}

const allUsers=async(req,res,next)=>{
  try{ 
     const allusers=await User.find({isAdmin:false}).sort({username:1})
     if(req.query.type==='filter'){
     const p=allusers.map((p)=>{
          return ({
             image:p.profilePicture,
             name:p.username
          }
          )

          
     })
     res.status(200).json(p)
    }else{
      res.status(200).json(allusers)
    }
  }catch(err){
    console.log(err)
    next(err)
  }
}


const userFollowing=async function(req,res,next){
  if(req.body.userId!=req.params.id){
    try{
        const user=await User.findById(req.params.id);
        const curruser=await User.findById(req.body.userId);
        if(!user.followers.includes(curruser._id)){
            await user.updateOne({$push:{followers:req.body.userId}});
            await curruser.updateOne({$push:{following:req.params.id}});
            res.status(201).json("Succesfully followed")
        }else{
            await user.updateOne({$pull:{followers:req.body.userId}});
            await curruser.updateOne({$pull:{following:req.params.id}});
            res.status(201).json("Succesfully unfollowed")
        }
        
    }catch(err){
        next(err)
}
    }
  }


const savePost=async(req, res,next)=>{
    try{
       const user=await User.findById(req.body.id)
        if(user.savedPost.includes(req.body.postId)){
                await User.findByIdAndUpdate(user._id,{$pull:{savedPost:req.body.postId}})
                res.status(200).json("Removed from the saved posts")
        }else{
          await User.findByIdAndUpdate(user._id,{$push:{savedPost:req.body.postId}})
          res.status(200).json("Saved the post")
        }
    }catch(err){
      next(err)
    }
}  

const blockUser=async(req, res,next)=>{
  try{
     console.log(req.params.id)
       const user=await User.findOne({username:req.params.id})
       console.log(user)
       if( user && user.block){
        await User.findOneAndUpdate({username:req.params.id},{$set:{block:false}});
       res.status(200).json("unBlocked the user")
       }else{
        await User.findOneAndUpdate({username:req.params.id},{$set:{block:true}});
        res.status(200).json("Blocked the user")
       }
       
  }catch(err){
    next(err)
  }
}

const changeToprivate=async(req, res,next)=>{
  try{
    const user=await User.findOne({_id:req.params.id})
    if(user.private){
      await User.findByIdAndUpdate(req.params.id,{$set:{private:false}});
    res.status(200).json("Changde the account to public ")
    }else{
      await User.findByIdAndUpdate(req.params.id,{$set:{private:true}});
    res.status(200).json("Changed the account to private")
    }
    
  }catch(err){
    next(err)
  }
}

const comingRequest=async(req, res,next)=>{
  try{
    const user=await User.findById(req.body.id)
    if(user.request.includes(req.body.userId)){
      await User.findByIdAndUpdate(req.body.id,{$pull:{request:req.body.userId}})
      res.status(200).json("Request Removed")
    }else{
      await User.findByIdAndUpdate(req.body.id,{$push:{request:req.body.userId}})
      res.status(200).json("Request accepted")
    }
   
  }catch(err){
    next(err)
  }
}

const getRequest=async(req, res,next)=>{
  try{
      const user=await User.findById(req.params.id);
      const allrequest=await User.find({_id:{$in:user.request}})
      res.status(200).json(allrequest)
  }catch(err){
    throw err
  }
}

const deleteRequest=async(req,res,next)=>{
  try{
    console.log(req.body.id)
      await User.findByIdAndUpdate(req.body.id,{$pull:{request:req.body.userId}},{new:true})
      res.status(200).json("Removed from the request")
  }catch(err){
    next(err)
  }
}

const allFriends=async function(req,res){
  const friends=[];
  try{
   const user=await User.findById(req.params.id)
   await Promise.all(
    user.following.map(async (f)=>{
          const frienduser=await User.findById(f);
          friends.push(frienduser)
    })
   )
   res.status(201).json(friends)
  }catch(err){
    res.status(404).json(err)
  }
}

const verifyUser=async(req,res,next)=>{
   try{
      await User.findByIdAndUpdate(req.body.id,{$set:{certificate:req.body.certificate}},{new:true})
      res.status(200).json("verified")
   }catch(err){
    next(err)
   }
}

const getVerifyUser=async(req,res,next)=>{
  try{
    const verify=await User.find({'certificate.submitted':true,'certificate.verified':false})
    res.status(200).json(verify)
 }catch(err){
  next(err)
 }
}


const payMoney=()=>{
  
}

const acceptVerify = async (req, res, next) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.EMAILID,
        pass: process.env.PASSWORD,
      },
    });
    if (req.body.accept) {
      const mailOptions = {
        from: 'testingjobee007@gmail.com',
        to: req.body.email,
        subject: 'Email Verification',
        html: `<div>
          <p>Hello ${req.body.username} your account has been verified.</p>
         
        </div>`,
      };

      await transporter.sendMail(mailOptions);

      await User.findOneAndUpdate(
        { email: req.body.email },
        { 'certificate.verified': true },
        { new: true }
      );

      res.status(200).json("Email sent");
    } else {
      const mailOptions = {
        from: 'testingjobee007@gmail.com',
        to: req.body.email,
        subject: 'Email Verification',
        html: `<div>
          <p>Hello ${req.body.username} your account has been rejected due to ${req.body.reason}. Please make the necessary corrections.</p>
        </div>`,
      };

      await transporter.sendMail(mailOptions);

      
      await User.findOneAndUpdate(
        { email: req.body.email },
        { 'certificate.submitted': false },
        { new: true }
      );

      res.status(200).json("Email sent");
    }
  } catch (err) {
    next(err);
  }
};


const getMutuals = async (req, res, next) => {
  const followers1 = await User.findById(req.query.userId1).populate('followers');
  const followers2 = await User.findById(req.query.userId2).populate('followers');

  const mutuals = new Set();

  for (const follower of followers1.followers) {
    if (followers2.followers.has(follower.id)) {
      mutuals.add(follower);
    }
  }

  return Array.from(mutuals);
};


const getFollowersList=async(req, res, next)=>{
  try{
    const user= await User.findOne({_id:req.query.id})
    
    let followers
    if(req.query.type==='true'){
      followers = await User.find({ _id:{$in:user.followers}});
    }else{
       followers = await User.find({ _id:{$in:user.following}});
    }
      console.log(followers)
    res.status(200).json(followers);
    

  }catch(err){
    next(err)
  }
}




module.exports={
    getUserProfile,
    updatePictures,
    updateProfile,
    allUsers,
    userFollowing,
    savePost,
    blockUser,
    changeToprivate,
    comingRequest,
    getRequest,
    deleteRequest,
    allFriends,
    verifyUser,
    getVerifyUser,
    acceptVerify,
    getFollowersList,
    getMutuals
}