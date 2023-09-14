const { createConvo, getConvo, find } = require("../controller/conversationController");

const router=require("express").Router();

//get new conversation
router.post("/conversation",createConvo)

//get conversation
router.get("/conversation/:id",getConvo)

//get single convo
router.get("/conversation/get/chat",find)

module.exports=router