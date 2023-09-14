const router=require("express").Router();
const validateMiddleware=require('../middleaware/validator')
const { userRegistration,userLogin, sendEmailVerification, verifyEmail, getUser, changePassword} = require("../controller/authController");

//register
router.post("/auth/register",validateMiddleware,userRegistration)

//login
router.post("/auth/login",userLogin)

//otp sending
router.post("/auth/useremail",sendEmailVerification);

//otp verification
router.post("/auth/userverify",verifyEmail)

//to check if the user exists 
router.post("/auth/exist",getUser);

//to change the password
router.post("/auth/changepassword",changePassword);

module.exports=router