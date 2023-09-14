import React from 'react'
import { useDispatch } from 'react-redux'
import { clickFeed } from '../redux/features/cross'
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router';


function AdminPanel() {
  const dispatch=useDispatch()
  const navigate=useNavigate()
  return (
    <div className="p-2 bg-white  w-60 h-screen">
    <div className='flex justify-end m-2 lg:hidden'>
        <CloseIcon onClick={()=>dispatch(clickFeed())}/>
        </div>
       <p className="text-xl bg-blue-400 text-white px-4 py-2 rounded-lg text-center ">DashBoard</p>
       <p className='text-xl my-5 text-center hover:bg-slate-300 hover:p-2 hover:rounded-lg' onClick={()=>navigate('/admin')}>All Users</p>
       <hr/>
       <p className='text-xl my-5 text-center hover:bg-slate-300 hover:p-2 hover:rounded-lg'  onClick={()=>navigate('/post/report')}>Post Reports</p>
       <hr/>
       <p className='text-xl my-5 text-center hover:bg-slate-300 hover:p-2 hover:rounded-lg'  onClick={()=>navigate('/admin/verifyuser')}>Verify User</p>
       <hr/>
       <p></p>
    </div>
  )
}

export default AdminPanel