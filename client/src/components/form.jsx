import React, { useRef,useState} from 'react'
import {authlogin, emailVerify, register, sendEmailVerification, userExist} from "../api/auth"
import { CircularProgress } from '@mui/material';
import {useDispatch} from "react-redux"
import { useNavigate } from 'react-router-dom'
import {Modal,message} from 'antd'
import { logIn } from '../redux/features/auth';

function Form({page,admin}) {

   //form Details
   const username=useRef();
   const email=useRef();
   const password=useRef();
   const repassword=useRef()
   const credentials=useRef()
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [change,setchange]=useState(false)
   const [loading,setloading]=useState(false)

   const dispatch=useDispatch()
   const navigate=useNavigate()


   const [otp,setotp]=useState({
    otp1:'',
    otp2:'',
    otp3:'',
    otp4:'',
    otp5:'',
    otp6:'',
  })

  const otpRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];


  const changePassword=async()=>{
    try{
       if(email.current.value){
        const response=await userExist(email.current.value,'user');
        if(response.data==="User with this email or username already exist"){
          const res=await sendEmailVerification(email.current.value,'user')
          message.success(res.data)
          setIsModalOpen(true) 
          setchange(true)
        }else{
          message.error("No such user")
        }
        
       }else{
          message.info("Enter your email")
       }
    }catch(err){
      throw err
    }
  }

  const handleLogin=async(e)=>{
    try{
      e.preventDefault()
      if(email.current.value && password.current.value){  
        setloading(true)
        
         const res=await authlogin(email.current.value,password.current.value)
         if(res.data.userId){
          
          dispatch(logIn(res.data))
          navigate("/")
          
         }else{
            message.info("Wrong email or password")
          setloading(false)
         }
      }
    }catch(err){
      throw err
    }
  }

  const handleSubmit=async(e)=>{
    try{
      e.preventDefault()

      if(username.current.value && email.current.value && password.current.value){
        if(password.current.value.length<8){
          password.current.setCustomValidity("Password must be at least 8 words")
        }else{
          if(password.current.value===repassword.current.value){
            const res=await userExist(email.current.value,username.current.value);
            if(res.data==="No such user"){
              setloading(true)
            const res=await sendEmailVerification(email.current.value,username.current.value)
            message.success(res.data)
           setIsModalOpen(true)
            }else{
              message.info(res.data)
            }
            
          }else{
            message.info("Password Mismatching")
          }
          
        }
       
      }else{

        setloading(false)
      }
    }catch(err){
      throw err
    }
  }

   const handleOk=async()=>{
     try{
         
         const userData={
            username: !change &&username.current.value,
            email:email.current.value,
            password:password.current.value,
            admin:admin,
            credentials:credentials.current.value
         }
          const OTP=otp.otp1+otp.otp2+otp.otp3+otp.otp4+otp.otp5+otp.otp6
           const response=await emailVerify(OTP,email.current.value);
           if(response.data==='Successfully logged in'){
            if(change){
               navigate('/forgetpassword')
            }else{
              const res=await register(userData)
            if(res.data==='Saved'){
              if(admin){
                navigate('/admin/login')
              }else{
                navigate('/login')
              }
                 
            }else{
              message.info(res.data)
             setloading(false)
            }
            }
            
           }else{
            
            setloading(false)
           }
         
     }catch(err){
        throw err
     }
   }

  return (
    <div >
        <form className='grid' onSubmit={page ? handleSubmit : handleLogin}>
        {
            page &&  <input type="text" name="username" placeholder="Enter your username" className='border-2 rounded-lg p-3 my-3 lg:w-3/4' ref={username} required/>
        }
           
            <input type="email" name="email" placeholder="Enter your email" className='border-2 rounded-lg p-3 my-3 lg:w-3/4 ' ref={email} required/>
            {admin &&   <input type="text" name="creaditinals" placeholder="Enter admin credentials" className='border-2 rounded-lg p-3 my-3 lg:w-3/4 ' ref={credentials} required/>}
            <input type="password" name="password" placeholder="Enter your password" className='border-2 rounded-lg p-3 mt-3 lg:w-3/4' ref={password} required min={8}/>
            {!page && <p className='text-sm text-blue-600 cursor-pointer' onClick={changePassword}>Forget Password</p>}
            { page && <input type="password" name="password" placeholder="Confirm your password" className='border-2 rounded-lg p-3 my-3 lg:w-3/4' ref={repassword} required min={8}/>}

            <button type="submit" className='bg-blue-500 text-white lg:w-3/4 p-3 rounded-lg mt-3'>
  {page ? (loading ? <CircularProgress /> : 'Sign In') : (loading ? <CircularProgress /> : 'Log In')}
</button>

        </form>
        {page ? (
          <>
            <p className="mt-3 ">
              Do you have an account?
              <a href="/login" className="text-blue-500 md:text-center">
                {' '}
                Login
              </a>
            </p>
          </>
        ) : (
          <>
            <p data-testid='otp' className="mt-3 text-slate-500">
              Don't have an account?
              <a href="/signin" className="text-blue-500 md:text-center">
                {' '}
                Create
              </a>
            </p>
          </>
        )}
        <Modal title="Otp verification" open={isModalOpen} onOk={handleOk} onCancel={()=>{setIsModalOpen(false)
        setloading(false)
        }}>
        <div  className="flex">
          <input
            className="border-2 rounded-xl text-center w-12 h-12 overflow-hidden mx-2"
            maxLength={1}
            type="text"
            onChange={(e) => {
              setotp({ ...otp, otp1: e.target.value });
              otpRefs[1].current?.focus();
            }}
            ref={otpRefs[0]}
          />
          <input
            className="border-2 rounded-xl text-center w-12 h-12 overflow-hidden mx-2"
            maxLength={1}
            type="text"
            onChange={(e) => {
              setotp({ ...otp, otp2: e.target.value });
              otpRefs[2].current?.focus();
            }}
            ref={otpRefs[1]}
          />
          <input
            className="border-2 rounded-xl text-center w-12 h-12 overflow-hidden mx-2"
            maxLength={1}
            type="text"
            onChange={(e) => {
              setotp({ ...otp, otp3: e.target.value });
              otpRefs[3].current?.focus();
            }}
            ref={otpRefs[2]}
          />
          <input
            className="border-2 rounded-xl text-center w-12 h-12 overflow-hidden mx-2"
            maxLength={1}
            type="text"
            onChange={(e) => {
              setotp({ ...otp, otp4: e.target.value });
              otpRefs[4].current?.focus();
            }}
            ref={otpRefs[3]}
          />
          <input
            className="border-2 rounded-xl text-center w-12 h-12 overflow-hidden mx-2"
            maxLength={1}
            type="text"
            onChange={(e) => {
              setotp({ ...otp, otp5: e.target.value });
              otpRefs[5].current?.focus();
            }}
            ref={otpRefs[4]}
          />
          <input
            className="border-2 rounded-xl text-center w-12 h-12 overflow-hidden mx-2"
            maxLength={1}
            type="text"
            onChange={(e) => {
              setotp({ ...otp, otp6: e.target.value });
              otpRefs[5].current?.blur();
            }}
            ref={otpRefs[5]}
          />
        </div>
      </Modal>
    </div>
  )
}

export default Form