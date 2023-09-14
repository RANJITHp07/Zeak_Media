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
import NavbarPanel from '../components/navbarPanel'
import { useSelector } from 'react-redux'
import SavedPost from '../components/savedPost'

function ProfilePage() {


  const  userId  = JSON.parse(localStorage.getItem("token")).userId
  const[isModel,isOpenModel]=useState(false)
  const navclick=useSelector((state)=>state.crossReducer.value.navcross);
  const click=useSelector((state)=>state.crossReducer.value.cross);
  const [post,setpost]=useState([])
  const dispatch=useDispatch()

  console.log(click)

  useEffect(()=>{
    const fetchData=async()=>{
       const res=await getUserProfile(userId);
         dispatch(userDetail(res.data))
    }
    fetchData()
  },[])

  useEffect(()=>{
    const fetchData=async()=>{
      const res=await userPosts(userId)
    
      setpost(res.data)
    }
    fetchData()
  },[userId])
  return (
    <div>
      
        <ProfileHeader isOpenModel={isOpenModel} page={false}/>
        
        <div className='w-10/12 md:hidden'>
        <Personalinfo page={false} privates={true}/>
        </div>
        {
          navclick &&
          <div
            className="fixed top-0 left-0 right-0 bottom-0 flex  bg-black bg-opacity-50 z-50 lg:hidden"
          >
             <NavbarPanel/>
          </div>
         
        }

        {
        click &&
        <div
            className="fixed top-0 left-0 right-0 bottom-0 flex  bg-black bg-opacity-50 z-50 "
          >
            <SavedPost/>
          </div>
      }
        
        <div className="flex lg:mx-10">
            <div className="md:w-4/6 w-full">
            <button className="bg-blue-600 text-white p-2 m-3 rounded-lg md:hidden" onClick={()=>isOpenModel(true)}>Update</button>
            <div className=' my-12 mx-3'> <p className="text-xl font-semibold  w-full">{post.length} posts</p></div> 
             {
               post.length>0 && post.map((p)=>{
                return (
                  <Post post={p} page={true}/>
                )
                      
               })
             }
            </div>
            
            <Modal  open={isModel} footer={null} onCancel={()=>isOpenModel(false)}>
            <UpdateProfile/>
      </Modal>
            <div className='lg:w-96 w-56 hidden md:block'>
                <Personalinfo page={false} privates={true}/>
            </div>
        </div>
        
    </div>
  )
}

export default ProfilePage