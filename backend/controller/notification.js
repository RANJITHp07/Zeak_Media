const Notification=require("../model/notification");


const createNotificaton=async(req,res,next)=>{
    try{
      await Notification.create(req.body)
      res.status(200).json("Created the notification")
    }catch(err){
        next(err)
    }
}

const deleteoneNotification=async(req,res,next)=>{
    try{
         await Notification.findByIdAndDelete(req.params.id);
         res.status(200).json("deleted successfully")
    }catch(err){
        next(err)
    }
}

const deleteAllNotification=async(req,res,next)=>{
    try{
        await Notification.deleteMany({userId:req.params.id});
        res.status(200).json("deleted successfully")
    }catch(err){
        next(err)
    }
}

const getAllNotification=async(req,res,next)=>{
    try{
        const notification=  await Notification.find({userId:req.params.id})
        res.status(200).json(notification)
    }catch(err){
        next(err)
    }
}

module.exports={
    deleteAllNotification,
    deleteoneNotification,
    getAllNotification,
    createNotificaton
}