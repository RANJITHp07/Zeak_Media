import React,{useEffect,useState} from 'react'
import ProfileHeader from '../components/profileHeader'
import Post from '../components/post'
import Personalinfo from '../components/personalinfo'
import { userPosts } from '../api/post'
import { useDispatch } from 'react-redux'
import { getUserProfile } from '../api/user'
import { userDetail } from '../redux/features/user'
import {Modal} from "antd"
import UpdateProfile from '../components/updateProfile'
import { useParams } from 'react-router-dom';

function FriendProfilePage() {

  const { username } = useParams();
  const  userId  = JSON.parse(localStorage.getItem("token")).userId
  const[isModel,isOpenModel]=useState(false)
  const [post,setpost]=useState([])
  const [privates,setprivate]=useState(false)

  const dispatch=useDispatch()

  useEffect(()=>{
    const fetchData=async()=>{
       const res=await getUserProfile(username);
        if(res.data.private && !res.data.followers.includes(userId)){
           setprivate(true)
           console.log(true)
        }
         dispatch(userDetail(res.data))
         const response=await userPosts(res.data._id)
    
      setpost(response.data)
    }
    fetchData()
  },[])

  return (
    <div>
      
        <ProfileHeader isOpenModel={isOpenModel} page={false}/>
        <div className='w-10/12 md:hidden'>
       <Personalinfo page={true} privates={privates}/>
        </div>
        <div className="flex lg:mx-10">
            <div className="md:w-4/6 w-full">
            <button className="bg-blue-600 text-white p-2 m-3 rounded-lg md:hidden" onClick={()=>isOpenModel(true)}>Update</button>
            <div className='my-12'>
  <p className="text-xl font-semibold w-full">
    {post.length} posts
  </p>
</div>
             {
              privates ?<div className="w-full h-72 text-8xl text-slate-300 font-bold">Account is Private</div> :
               post.length>0 && post.map((p)=>{
                return (
                  <Post post={p} page={false}/>
                )
                      
               })
             }
             
             
            </div>
            <Modal  open={isModel} footer={null} onCancel={()=>isOpenModel(false)}>
            <UpdateProfile/>
      </Modal>
            <div className='lg:w-96 w-56 hidden md:block'>
                <Personalinfo page={true} privates={privates}/>
            </div>
        </div>
        
    </div>
  )
}

export default FriendProfilePage