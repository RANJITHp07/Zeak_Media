const { createNotificaton, getAllNotification, deleteAllNotification, deleteoneNotification } = require("../controller/notification");

const router=require("express").Router();

//create notification
router.post("/create/notification",createNotificaton);

//to get all the notifications from
router.get("/create/notification/:id",getAllNotification);

//to delete all notification
router.delete("/create/notification/:id",deleteAllNotification);

//to delete one notification

router.delete("/delete/notification",deleteoneNotification)


module.exports=router;
