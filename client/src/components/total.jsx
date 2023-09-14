import React ,{useState,useEffect} from 'react'
import { allusers } from '../api/user'

function Total() {

    const [user,setuser]=useState([])
    useEffect(()=>{
        const fetchData=async()=>{
             const res=await allusers()
             setuser(res.data)
        }
        fetchData()
    },[])
  return (
    <div className="mt-8 p-4 w-full rounded-lg" style={{ boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px' }}>
        <p className='text-xl font-bold text-indigo-900'>Total Users</p>
        <p className='text-xl font-bold text-indigo-900'>{user.length} users</p>

    </div>
  )
}

export default Total