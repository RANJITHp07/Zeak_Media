const router=require('express').Router();
const { createMessage, findMessage, handlePhoto } = require('../controller/messageController');
const multer=require('multer')

const storage = multer.memoryStorage()
const upload = multer({ storage: storage });


router.post("/message",createMessage)

//get
router.get("/messages/:conversationId",findMessage)

//get the url
router.post("/find/image/url",upload.single('file'),handlePhoto)

module.exports=router