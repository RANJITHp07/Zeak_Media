import React from 'react'
import AdminPanel from '../components/adminPanel'
import Alluser from '../components/alluser'
import Total from '../components/total'
import {useDispatch, useSelector} from "react-redux"
import { clickFeed } from '../redux/features/cross'

function AdminPage() {
  const click=useSelector((state)=>state.crossReducer.value.cross)
  const dispatch=useDispatch()

  return (
    <div className="">
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
        <div className=' w-full md:w-10/12 lg:w-1/2 p-5'>
           <Alluser/>
        </div>
        <div  className='w-1/4 mx-7 p-5 hidden md:block'>
          <Total/>
        </div>
      </div>
    </div>
  )
}

export default AdminPage