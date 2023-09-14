import React, { useEffect,useState } from 'react'
import { useDispatch } from 'react-redux'
import AdminPanel from '../components/adminPanel'
import { useSelector } from 'react-redux';
import { clickFeed } from '../redux/features/cross';
import { reportedPost } from '../api/post';
import ReportPost from '../components/reportPost';


function PostReportPage() {
    const dispatch=useDispatch();
    const click=useSelector((state)=>state.crossReducer.value.cross)
    const [posts,setposts]=useState([])

    useEffect(()=>{
      const fetchData=async()=>{
        const res=await reportedPost();
        console.log(res.data)
        setposts(res.data)
      }
      fetchData()
    },[])


  return (
    <div>
        <div className="p-5 w-full bg-blue-500">
      <p className='text-4xl font-extrabold text-white'>Zeak Media</p>
      </div>
      <button className='p-2 rounded-lg text-white bg-blue-500 m-2 lg:hidden' onClick={()=>dispatch(clickFeed())}>DashBoard</button>
      <div className='flex'>
        <div className=' p-4 border-r-2 hidden lg:block'>
          <AdminPanel/>
        </div>
        {
        click &&
        <div
            className="fixed top-0 left-0 right-0 bottom-0 flex  bg-black bg-opacity-50 z-50 lg:hidden"
          >
            <AdminPanel/>
          </div>
      }
      <div className=' w-full p-5'>
      <p className='text-xl font-semibold mb-6'>Show all the reported posts</p>
           {
            posts.map((p)=>{
                return (
                    <ReportPost post={p}/>
                )
            })
           }
        </div>
      </div>
    </div>
  )
}

export default PostReportPage