const conversation = require("../model/conversation");
const Message=require("../model/message")
const { S3Client, PutObjectCommand,GetObjectCommand }=require("@aws-sdk/client-s3")
const crypto = require('crypto')
const dotenv=require('dotenv')


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

//to create an message
const createMessage=async function(req,res,next){
    const newmessage=new Message(req.body);
    try{
        const message=await newmessage.save();
        await conversation.findByIdAndUpdate(req.body.conversationId,{$set:{latestMessage:req.body.text}})
        res.status(201).json(message)
    }catch(err){
        next(err)
    }
}

//to find all the message of an conversation
const findMessage=async function(req,res,next){
    try{
        const message=await Message.find({conversationId:req.params.conversationId}) 
        res.status(201).json(message)
    }catch(err){
        next(err)
    }
    
}

const handlePhoto=async(req,res,next)=>{
    const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')
  const imageName = generateFileName();
  const file=req.file
  
  console.log(file)
  

  const uploadParams = {
    Bucket: bucketName,
    Body: file.buffer,
    Key: imageName,
    ContentType: file.mimetype
  }
  await s3Client.send(new PutObjectCommand(uploadParams));
  res.status(200).json(imageName)
}


module.exports={
    findMessage,
    createMessage,
    handlePhoto
}