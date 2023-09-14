import React,{useEffect,useState} from 'react'
import ClearIcon from '@mui/icons-material/Clear';
import { useDispatch } from 'react-redux';
import { navclickFeed } from '../redux/features/cross';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import LogoutIcon from '@mui/icons-material/Logout';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import { allusers } from '../api/user';
import { useNavigate } from 'react-router';
import { logOut } from '../redux/features/auth';


function NavbarPanel() {
    const dispatch=useDispatch()
    const [user,setuser]=useState([])
    const [filter,setfilter]=useState([])
    const [state,setstate]=useState(false)
    const navigate=useNavigate()

    useEffect(()=>{
        const fetchData=async()=>{
             const res=await allusers()
             setuser(res.data)
        }
        fetchData()
    },[])

    const handleChange=(e)=>{
        try{
          
         if(e.target.value.length!=0 && filter.length>0){
           setstate(true)
          const newFilter = user.filter((value) => {
            return value.name.toLowerCase().includes(e.target.value.toLowerCase());
          });
          setfilter(newFilter)
         }
         else if(filter.length===0){
          setstate(true)
            setfilter(user)
         }else{
          setstate(false)
         }
        
           
        }catch(err){
          throw err
        }
      }

  return (
    <div className="w-3/4 md:w-1/2 h-screen bg-white lg:w-full lg:border-2 border-slate-200">
    <div className='lg:hidden flex justify-end my-3 mx-2'>
        <ClearIcon className='' onClick={()=>dispatch(navclickFeed())}/>
      </div>
         <input type="text" className="border-2 mx-3 w-10/12 p-2 rounded-md" placeholder='Search your friend' onChange={handleChange}/>
         {state &&<div className='absolute  bg-white my-3 h-40 overflow-y-scroll w-3/4 rounded-lg overflow-hidden p-3' style={{ boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px' }}>
                {
                 filter.length>0? filter.map((p)=>{
                     return(
                      <div className='flex my-3 items-center cursor-pointer' onClick={()=>navigate(`/user/${p.name}`)}>
                      <img src={process.env.PUBLIC_URL + '/images/profile.webp'} className='rounded-full w-7 h-7 mx-3 ml-6'/>
                      <p className='text-sm'>{p.name}</p>
                      <hr/>
                      </div>
                       
                     )
                  }):
                  <div className='flex my-3 items-center'>
                  <img src={process.env.PUBLIC_URL + '/images/profile.webp'} className='rounded-full w-7 h-7 mx-3 ml-6'/>
                  <p className='text-slate-300'>No such user</p>
                  </div>
                } 
            </div>
            }
         <p className="text-lg mx-3 my-3 hover:bg-slate-200 hover:p-2 hover:rounded-lg" onClick={()=>navigate(`/profile`)}><AccountBoxIcon/> Profile</p>
         <hr/>
         <p className="text-lg mx-3 my-3 hover:bg-slate-200 hover:p-2 hover:rounded-lg"><RssFeedIcon/> Feed</p>
         <hr/>
         <p className="text-lg mx-3 my-3 hover:bg-slate-200 hover:p-2 hover:rounded-lg" onClick={()=>{dispatch(logOut())
          navigate('/login')}}><LogoutIcon/> Logout</p>
         <hr/>
    </div>
  )
}

export default NavbarPanel