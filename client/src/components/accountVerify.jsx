import React, { useState ,useEffect} from 'react'
import { getPost } from '../api/post'
import { postverifyUseraccount } from '../api/user'
import { message } from 'antd'
import {Modal} from 'antd'


function AccountVerify({p}) {

    const [url,seturl]=useState()
    const [isModalOpen,setIsModalOpen]=useState(false)
    const[reason,setreason]=useState('')

    useEffect(()=>{
        const fetchData=async()=>{
            const res=await getPost(p.certificate.file)
            seturl(res.data)
        }
        fetchData()
        

    },[])

    const handleAccept=async()=>{
        try{
           await postverifyUseraccount({email:p.email,username:p.certificate.name,accept:true})
           message.info("Verification email send")
        }catch(err){
            throw err
        }
    }

    const handleOk=async()=>{
        try{
            setIsModalOpen(false)
            console.log({email:p.email,username:p.certificate.name,accept:false,reason:reason})
            await postverifyUseraccount({email:p.email,username:p.certificate.name,accept:false,reason:reason})
            message.info("Rejection email send")
           
         }catch(err){
             throw err
         }
    }

  return (
    <div className="p-6 w-full flex justify-between rounded-lg items-center" style={{ boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px' }}>
    <div className='p-6 '>
    <p className="text-xl"><b> Name: </b> {p.certificate.name}</p>
        <p className="text-xl"><b>Certificate Name :</b> {p.certificate.filename}</p>
        <div className='flex my-3'>
        <button className='bg-red-500 text-white p-2 rounded-lg cursor-pointer mr-3 ' onClick={()=>setIsModalOpen(true)}>Reject</button>
        <button className='bg-green-500 text-white p-2 rounded-lg cursor-pointer' onClick={handleAccept}>Accept</button>
        </div>
    </div>
    <Modal  open={isModalOpen} onOk={()=>handleOk()} onCancel={()=>{setIsModalOpen(false)}}>
     <label>
        Reason to reject
     </label>
     <textarea className='w-full h-72 border-2 p-2 rounded-lg my-3' onChange={(e)=>setreason(e.target.value)}/>
    </Modal>
    <a href={url} target="_blank" rel="noopener noreferrer" className='bg-green-500 text-white p-2 rounded-lg cursor-pointer'>Certificate</a>
    
    </div>
  )
}

export default AccountVerify