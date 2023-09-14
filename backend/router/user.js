const router=require("express").Router();
const {getUserProfile, updatePictures, updateProfile,allUsers, userFollowing,savePost, blockUser, changeToprivate, comingRequest, getRequest, deleteRequest, verifyUser, getVerifyUser, acceptVerify, getFollowersList, getMutuals}=require('../controller/userController')
const User=require("../model/user")

const multer=require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage });

//update user
router.put("/user/:id",updateProfile)

//delete user
router.delete("/:id",async function(req,res){
    const user= await User.findOne({_id:req.params.id})
    try{
        if(user){
            await User.deleteOne({_id:req.params.id});
            res.status(201).json("Succesfully deleted")
        }
    }catch(err){
        res.status(401).json(err)
    }
})

//get a user using id
router.get("/user/:id",getUserProfile)

//update the profilePicture
router.put('/user/update_profile/:id',upload.single('file'),updatePictures)

//get all users 
router.get('/user/get/allusers',allUsers)

//to save posts

router.post('/user/savepost',savePost)

//to accept the request
router.put("/user/accept/id",comingRequest)

//to get all the request
router.get("/user/accept/id/:id",getRequest)

//to delete the request
router.put("/user/delete/id",deleteRequest)

//block the user

router.put("/user/block/:id",blockUser)

//follow a user
router.put("/:id/follow",userFollowing)


//to privatise the account

router.put("/private/:id",changeToprivate)


//get all friends
router.get("/allfriends/:id",)

//to verify
router.put("/user/account/verify",verifyUser)

//to get all the verified user
router.get("/user/account/verify",getVerifyUser)

//to send email to the user
router.post("/user/account/verify",acceptVerify)

//get the followers of the user
router.get("/user/get/followers",getFollowersList)

//get the mutuals
router.get("/user/get/mutuals",getMutuals)

module.exports=router