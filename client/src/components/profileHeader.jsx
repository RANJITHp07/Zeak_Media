import React,{useMemo,useState}  from 'react'
import Navbar from './navbar'
import {useSelector} from "react-redux"
import { getPost } from '../api/post';

function  ProfileHeader({isOpenModel,page}) {

  
  const user=useSelector((state)=>state.userReducer.value.user);
  const [url,seturl]=useState({
    cover:'',
    profile:''
  })
  useMemo(()=>{
    if(user){
      const fetchData=async()=>{
        if(user.coverPicture!=''){
          const res=await getPost(user.coverPicture);
          seturl((prev) => ({ ...prev, cover: res.data }));
        }
        
      if(user.profilePicture!=''){
        const res=await getPost(user.profilePicture);
        seturl((prev) => ({ ...prev, profile: res.data }));
       
      }
    }
    fetchData()
    }
    
    
  },[user])

 
  return (
    <div>
        <Navbar/>
        {
          user && <>
          <div className='w-full h-72 overflow-hidden'>
          <img src={user.coverPicture==='' ? process.env.PUBLIC_URL + '/images/backprofile.jpg' : url.cover} className='w-full h-full '/>
          </div>
          
        <div className='flex justify-center items-center'>
        <img src={user.profilePicture==='' ? process.env.PUBLIC_URL + '/images/profile.jpg':url.profile} className='w-56 h-56 items-center absolute border-2 rounded-full'/>
        
        </div>
          </>
        }
       
        { !page &&<button className="bg-blue-600 text-white p-2 m-3 rounded-lg hidden md:block" onClick={()=>isOpenModel(true)}>Update</button>}
        <div className={page ? 'md:mt-24 mt-28':'md:mt-32 mt-32' }>
          {
            user && <>
            <p className='text-center my-7'>{user.username}</p>
            <div className='flex justify-center'>
              <div>
              <p className='mx-5 text-xl font-semibold' >Followers</p>
              <p className='text-center'>{ user.followers.length}</p>

              </div>
                <div>
                <p className='mx-5 text-xl font-semibold'>Following</p>
                <p className='text-center'>{ user.following.length}</p>
                </div>

                
            </div>
            </>
          }
        </div>
    </div>
  )
}

export default ProfileHeader