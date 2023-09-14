import React,{useRef,useState} from 'react'
import { uplaodFile } from '../api/message'
import { verifyUseraccount } from '../api/user';
import { message } from 'antd';
import { useNavigate } from 'react-router';


function VerifyForm() {
 
    const [file,setfile]=useState(null)
    const  userId  = JSON.parse(localStorage.getItem("token")).userId
    const user=useRef();
    const type=useRef();
    const navigate=useNavigate()

    
    
    const handleUplaod=async()=>{
        try{
            if(user.current.value && type.current.value && file ){
                const formData = new FormData();
                formData.append('file', file);
                const res=await uplaodFile(formData)
     
                const certificate={
                   name:user.current.value,
                   filename:type.current.value,
                   file:res.data,
                   submitted:true,
                   verified:false
                }
     
                await verifyUseraccount(userId,certificate)
                message.info("Verification Request send")
                navigate("/profile")
            }else{
                message.info("Fill al the fields")
            }
            



        }catch(err){
            throw err
        }
    }

  return (
    <div className="lg:w-1/2 mx-5 lg:mx-auto mt-16 p-4 rounded-lg" style={{ boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px' }}>
    <p className='text-xl text-center'>Verify you account</p>
     
        <div className='grid my-3'>
            <label>Username</label>
            <input type='text' placeholder='Enter your username' className='p-2 border-2 w-full rounded-lg' ref={user} />
        </div>
        <div className='grid my-3'>
            <label>File</label>
            <input type='text' placeholder='Enter name of the certificate' className='p-2 border-2 w-full rounded-lg' ref={type} />
        </div>
        <label>Upload</label>
        <div className='w-full h-72 border-2 cursor-pointer' >
         <label htmlFor='file'>
         {
            file ?  <img src={URL.createObjectURL(file)} alt='img' className='my-3 h-60 w-3/4 mx-auto'/> :
            <img src={process.env.PUBLIC_URL + '/images/upload.png'} alt='image' className='w-60 h-60 opacity-50 filter grayscale mx-auto mt-4'/>

         }
         </label>
          <input type='file' className='hidden' name='file' id='file' onChange={(e)=>setfile(e.target.files[0])}/>
        </div>
          <button className='bg-blue-500 text-white w-full mt-3 rounded-lg text-center p-2' onClick={()=>handleUplaod()}>Upload</button>
      
    </div>
  )
}

export default VerifyForm