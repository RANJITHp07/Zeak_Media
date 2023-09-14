import React, { useState,useMemo } from 'react'
import { blockPost, getPost } from '../api/post';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Dropdown, message } from 'antd';


function ReportPost({post}) {
    const [url,seturl]=useState({
        post:post.img,
        profile:''
    })
    
    async function handleBlock(id){
        try{
           const res=await blockPost(id)
           message.info(res.data)
        }catch(err){
            throw err
        }
    }

    const items= [
        {
          key: '1',
          label: (
            <p onClick={()=>handleBlock(post._id)}>
              Block
            </p>
          ),
        },
        {
          key: '2',
          label: (
            <p >
              Visit profile
            </p>
          ),
        }
      ];

    useMemo(()=>{
    
        const fetchData=async()=>{
    
          if(url.post!=''){
            const res=await getPost(post.img);
            
            if(post.userId.profilePicture!=''){
              const response=await getPost(post.userId.profilePicture)
              seturl({profile:response.data,post:res.data})
            }else{
              seturl({profile:'',post:res.data})
            }   
            
          }
          
        }
        fetchData()
      },[])


  return (
    <div className='my-12 flex'>
       <div style={{"box-shadow": "rgba(0, 0, 0, 0.35) 0px 5px 15px"}} className='p-5 rounded-lg  w-full md:w-1/2 lg:w-3/4'>
       <div className="flex items-center  mb-5">
       
    <img src={post.userId.profilePicture==='' ? process.env.PUBLIC_URL + '/images/profile.jpg' : url.profile} className='rounded-full w-10 h-10 mx-2'/>
    <div>
    <p>{post.userId.username}</p>
    <p className='text-xs'>{post.location}</p>
    </div>
    <div className='ml-auto'>
    <Dropdown menu={{ items }} placement="bottom" arrow>
           <MoreVertIcon/>
    </Dropdown>
    </div>
    
    </div>
        <img src={url.post} className="w-full h-96"/>
       </div>
       <div className='mx-6 p-5 rounded-lg w-1/4 md:w-1/2 lg:w-1/4 hidden md:block' style={{"box-shadow": "rgba(0, 0, 0, 0.35) 0px 5px 15px"}}>
        <p className='text-xl font-bold text-slate-500'>Report</p>
        <p>
Reporting inappropriate content found by users. Requesting a review of reported content, user accounts, and appropriate actions like warnings, suspensions, or bans if violations are confirmed. Prioritizing user safety, community standards, and transparent communication to ensure a respectful online environment</p>
       <p>The reasons given by the users are
        <ul>
            {
                post.reason.map((p)=>{
                    return(
                       <li>.{p}</li>
                    )
                })
            }
        </ul>
       </p>
       </div>
    </div>
  )
}

export default ReportPost