import React,{useState,useEffect} from 'react'
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import {useSelector} from "react-redux"
import { useDispatch } from 'react-redux';
import { currConvo } from '../redux/features/convo';
import { getAllMessage } from '../api/message';
import { clickFeed } from '../redux/features/cross';
import { getPost } from '../api/post';


function Contact({setmessage,page}) {
  const contacts=useSelector((state)=>state.chatReducer.value.allUsers)
  const userId = JSON.parse(localStorage.getItem('token')) && JSON.parse(localStorage.getItem('token')).userId
  const [imageUrl,setImageUrl]=useState([])
  const [friends,setfriends]=useState([])
  const dispatch=useDispatch()

  console.log(contacts)
  

   const handleOnclick=async(p)=>{
     try{
      dispatch(currConvo({
        id:p.members[0]._id===userId ? p.members[1]._id :p.members[0]._id,
        name:p.members[0]._id===userId ? p.members[1].username :p.members[0].username,
        conversationId:p._id,
       }))
       const response=await getAllMessage(p._id)
    
     setmessage(response.data)
       
     }catch(err){
      throw err
     }
   }

   const getUrl=async(imageName)=>{
  
    if(imageName!=''){
      const res=await getPost(imageName);
      console.log(res.data)
      return res.data
    }

    return process.env.PUBLIC_URL + '/images/profile.webp'
    
  }

   useEffect(()=>{
    const fetchMessageUrls = async () => {
      const imageUrlPromises = contacts.map(async (p) => {
        
            return getUrl(p.members[0]._id===userId ? p.members[1].profilePicture :p.members[0].profilePicture ,);
      });
      console.log(imageUrlPromises)
  
      const resolvedUrls = await Promise.all(imageUrlPromises);
      setImageUrl(resolvedUrls);
    };
  
    fetchMessageUrls();
    setfriends(contacts)
   },[contacts])

   const handleChange=(e)=>{
    if(e.target.value.length!=0 && friends.length>0){
     
     const newFilter = contacts.filter((value) => {
      if(value.members[0]._id===userId){
        return value.members[1].username.toLowerCase().includes(e.target.value.toLowerCase());
      }else{
        return value.members[0].username.toLowerCase().includes(e.target.value.toLowerCase());

      }
       
     });
     setfriends(newFilter)
    }
    else if(friends.length===0){
   
       setfriends(contacts)
    }else{
      setfriends(contacts)
    }
   }


  return (
    <div className="w-3/4 md:w-1/2 h-full bg-white lg:w-full lg:border-r-2 border-slate-200">
        <div className='flex justify-end m-2 lg:hidden'>
        <CloseIcon onClick={()=>dispatch(clickFeed())}/>
        </div>
        <div className='bg-slate-100 rounded-full w-11/12 mx-auto  px-3 py-1 flex items-center lg:mt-8'>
            <SearchIcon className='text-slate-400 mx-2'/>
            <input type='text' placeholder='Search' className='bg-slate-100 w-3/4  focus:outline-none text-slate-600' onChange={handleChange} />

        </div>
        {
          contacts.length >0 ? friends.map((p,index)=>{
            return (
              <>
              <div className='mx-5 my-4 flex items-center cursor-pointer hover:bg-slate-200 hover:p-2 hover:rounded-md' onClick={()=>handleOnclick(p)}  >
            
            <img src={imageUrl[index]} alt="photo" className="rounded-full border-2 mr-3 h-9 w-9"/>
               <div>
               <p>{p.members[0]._id===userId ? p.members[1].username :p.members[0].username }</p>
               {p.latestMessage!='' ?<p className='text-xs'>lastest message : {p.latestMessage.slice(0,10)}...</p>:<p></p>}
               </div>      
        </div>
        <hr/>
              </>
            )
          }):<p className='text-slate-300 mx-8 my-4'>No contacts yet</p>
        }
        
      
        
    </div>
  )
}

export default Contact