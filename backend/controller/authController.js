const User=require("../model/user");
const bcrypt=require("bcrypt")
const jwt=require('jsonwebtoken')
const nodemailer=require('nodemailer')

let otp=new Map();

function generateOTP(){
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < 6; i++) {
      otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
  }


  async function sendEmailVerification(req,res,next) {
    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
          user: process.env.EMAILID,
          pass: process.env.PASSWORD,
        },
      });
      console.log("joo")
      const otps = generateOTP();
      otp.set(req.body.email, otps);

      const mailOptions = {
        from: 'testingjobee007@gmail.com',
        to: req.body.email,
        subject: 'Email Verification',
        html: `<div>Hello ${req.body.username}, please enter this OTP to verify your email: <strong>${otps}</strong></div>`,
      };

      await transporter.sendMail(mailOptions);
      res.status(200).json("Email sent")
    } catch (err) {
      console.error('Error sending email:', err);
      next(err)
    }
  }  


  async function verifyEmail(req,res,next) {
    try {
      const expectedOTP = otp.get(req.body.email);
      if (expectedOTP === req.body.otp) {
        otp.delete(req.body.email);
        res.status(200).json('Successfully logged in');
      } else {
        res.status(200).json('The OTP entered is incorrect');
      }
    } catch (err) {
      next(err)
    }
  }

const userRegistration=async(req,res,next)=>{
        const salt = await bcrypt.genSaltSync(10);
        const hashpassword =await  bcrypt.hashSync(req.body.password, salt);
        try{
           if(req.body.admin){
               if(process.env.CREDENTIALS===req.body.credentials){
                const newUser=new User({
                  username:req.body.username,
                  email:req.body.email,
                  password:hashpassword,
                  admin:true
              })
              await newUser.save();
              res.status(201).json("Saved")
               }else{
                res.status(201).json("Wrong Credentials")
               }
           }else{
            const newUser=new User({
              username:req.body.username,
              email:req.body.email,
              password:hashpassword
          })
         await newUser.save();
          res.status(201).json("Saved")
           }
            
        }catch(err){
           next(err)
        }
    }

 const userLogin=async(req,res,next)=>{
   
        try{
          console.log(req.body.password,req.body.email)
         const user= await User.findOne({email:req.body.email})
         if(user){
             const valid= await bcrypt.compareSync(req.body.password, user.password);
             if(valid){
                const token = jwt.sign(
                    { userId: user._id },
                    process.env.JWT_KEY, 
                    
                  );
                 res.status(200).json({userId:user._id,token});
             }
             else{
                 res.status(200).json("wrong password");
             }
         }
         else{
             res.status(200).json("wrong email");
         }
        }catch(err){
          
         next(err)
        }
     
}   

const getUser=async(req,res,next)=>{
   try{
    const {email,username}=req.body
     const user=await User.findOne({ $or: [{ email: email }, { username: username }] });
     if(user){
      res.status(200).json("User with this email or username already exist")
     }else{
      res.status(200).json("No such user")
     }
    
   }catch(err){
    next(err)
   }
}


const changePassword=async(req,res,next)=>{
  try{
    const salt = await bcrypt.genSaltSync(10);
    const hashpassword =await  bcrypt.hashSync(req.body.password, salt);
      await User.findOneAndUpdate({email:req.body.email},{$set:{password:hashpassword},new:true})

      res.status(200).json("Password Updated")
  }catch(err){
    next(err)
  }
}


module.exports={
    userRegistration,
    userLogin,
    sendEmailVerification,
    verifyEmail,
    getUser,
    changePassword
}
