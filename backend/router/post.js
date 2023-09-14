const router = require("express").Router();
const {deletePost,updatePost,newPost, getAllPosts, getPost, getUserPost, likePost, getPosturl, getSavedPost, report, getReportedPost, blockPost}=require("../controller/postController")
const multer=require('multer')

const storage = multer.memoryStorage()
const upload = multer({ storage: storage });

//create a post

router.post("/create/post",upload.single('file'),newPost);

//update a post

router.put("post/:id",updatePost);


router.delete("/post/delete/:id", deletePost);
//like / dislike a post

router.put("/like/:id",likePost );
//get a post

router.get("/:id",getPost );

//get all posts

router.get("/all/:userId",getAllPosts);


//get usersPost
router.get("/post/:id",getUserPost);

//to retrive the url of the image
router.get('/image/url',getPosturl)

//to get All the saved Posts
router.get("/get/savedpost",getSavedPost)

//get user's all posts

router.get("/post/:username",getUserPost );

//get imageName
router.get("/post/:username",getUserPost );

//to post the report
router.post("/post/report",report)

//to get all the reported posts
router.get("/getall/reportedpost", getReportedPost)

//to block a post
router.put("/block/post/:id",blockPost)


module.exports = router;