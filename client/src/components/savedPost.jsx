import React,{useState,useEffect} from 'react'
import ClearIcon from '@mui/icons-material/Clear';
import { useDispatch } from 'react-redux';
import { clickFeed } from '../redux/features/cross';
import {useSelector} from "react-redux"
import Post from './post';
import { getAllsavedPost } from '../api/post';

function SavedPost() {
    const dispatch=useDispatch()
    const user=useSelector((state)=>state.userReducer.value.user);
    const [post,setpost]=useState([])

    useEffect(()=>{
      if(user){
        const fetchData=async()=>{
          const res=await getAllsavedPost(user.savedPost)
          console.log(res.data)
          setpost(res.data)
        }
        fetchData()
      }
      
    },[user])
   
  return (
    <div className="p-8 h-screen bg-white w-full md:w-1/4 lg:w-1/3 overflow-scroll">
    <div className=' flex justify-end my-3'>
        <ClearIcon className='' onClick={()=>dispatch(clickFeed())}/>
      </div>
      {
        user && <>
        <p>Saved Post</p> 
       {
         post.length> 0 ? post.map((p)=>{
          return (
            <Post post={p}/>
          )
              
        }):<p>No saved Post</p>
       }
       </>
      }
       
    </div>
  )
}

export default SavedPost