const { createComment, getAllComments, updateComment, deleteComment } = require("../controller/comment");

const router = require("express").Router();

//create comment
router.post("/comment",createComment);

//update comment
router.put("/comment",updateComment);

//delete the comment
router.put("/comment/delete",deleteComment)

//get comments of a single post
router.get("/comments/:id",getAllComments);


module.exports=router


