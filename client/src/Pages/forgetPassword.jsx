import { message } from 'antd';
import React,{useRef} from 'react'
import { changePassword } from '../api/auth';
import { useNavigate } from 'react-router-dom';

function ForgetPassword() {

    const email=useRef(null);
    const password=useRef(null);
    const repassword=useRef(null)
    const navigate=useNavigate()

    const handleSubmit=async()=>{
        try{
              if(email.current.value && password.current.value && repassword.current.value){
                  if(password.current.value===repassword.current.value){
                    const res=await changePassword(email.current.value,password.current.value);
                    if(res.data==='Password Updated'){
                        navigate('/login')
                    }else{
                        message.info("Enter correct email")
                    }
                    
                  }else{
                    message.info("Password mismatch")
                  }
                    
              }else{
                message.info("Enter all the fields")
              }
        }catch(err){
            throw err
        }
    }
  return (
    <div>
        <div>
      <div className='grid place-content-center box_shadow p-5 rounded-xl  h-96 md:mx-12 lg:w-1/2 lg:mx-auto mt-16 '>
          <p className='text-indigo-950 font-semibold text-center text-2xl'>ENTER THE PASSWORD</p>
          <input type='email' className='border-2 border-gray-400 p-2 rounded-xl my-3' placeholder='Enter the email' ref={email}/>
          <input type='password' className='border-2 border-gray-400 p-2 rounded-xl my-3' placeholder='Enter the Newpassword' ref={password}/>
          <input type='password' className='border-2 border-gray-400 p-2 rounded-xl' placeholder='Confirm the password' ref={repassword}/>
          <button className='bg-blue-500 text-white font-semibold p-2 ml- rounded-xl my-5 w-full' onClick={()=>handleSubmit()}>SUBMIT</button>
            </div>
     
      
    </div>
    </div>
  )
}

export default ForgetPassword