const Conversation=require("../model/conversation")

const createConvo=async(req,res,next)=>{
    try{
        const convo=await Conversation.findOne({members:[req.body.senderId,req.body.recieveId]})
        console.log(convo)
        if(!convo){
            await Conversation.create({members:[req.body.senderId,req.body.recieveId],latestMessage:""})
            res.status(200).json("Created")
        }else{
            res.status(200).json("Already exist")
        }
        
    }catch(err){
          next(err)
    }
}

const getConvo=async(req,res,next)=>{
    try{
        const convo=await Conversation.find({members:{$in:[req.params.id]}}).populate("members").sort({updatedAt:-1})
        res.status(200).json(convo)
     }catch(err){
          next(err)
     }
}

const updateConvo=async(req,res,next)=>{
    try{
       await Conversation.findByIdAndUpdate(id, { $set: update },{new:true});
        res.status(200).json("Updated")
    }catch(err){
          next(err)
    }
}

const find=async(req,res,next)=>{
    try{
        const convo=await  Conversation.findOne({members:[req.query.senderId,req.query.recieveId]})
        res.status(200).json(convo)
    }catch(err){
        next(err)
    }
}

module.exports={
    find,
    updateConvo,
    createConvo,
    getConvo
}

