import React,{useState,useEffect} from 'react'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import ChatIcon from '@mui/icons-material/Chat';
import SearchIcon from '@mui/icons-material/Search';
import { Dropdown } from 'antd';
import {useDispatch} from 'react-redux'
import { logOut } from '../redux/features/auth';
import { useNavigate } from 'react-router-dom'
import { allusers, deleteRequest, follow, getRequest, getUserProfile } from '../api/user';
import MenuIcon from '@mui/icons-material/Menu';
import { navclickFeed } from '../redux/features/cross';
import {Modal} from "antd"
import { deletenotification, getnotification } from '../api/notification';
import { getPost } from '../api/post';


function Navbar() {
  const dispatch=useDispatch()
  const navigate=useNavigate()
  const [user,setuser]=useState([])
  const [filter,setfilter]=useState([])
  const [state,setstate]=useState(false)
  const [request,setrequest]=useState([])
  const [online,setonline]=useState([])
  const userId = JSON.parse(localStorage.getItem('token')) && JSON.parse(localStorage.getItem('token')).userId
  const [isModalOpen,setIsModalOpen]=useState(false)
  const [isModalOpen1,setIsModalOpen1]=useState(false)
  const [imageUrl, setImageUrl] = useState(null);
  const [profile,setprofile]=useState('')
  const [username,setusername]=useState('')

  //filter

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

  const handleCancel = async (id) => {
    try {
      
      await deleteRequest(userId, id);
      setrequest((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      throw err;
    }
  };
  
  const handleAccept=async(id)=>{
    try{
        await follow(userId,id)
        setrequest((prev) => prev.filter((p) => p._id !== id));
    }catch(err){
      
      throw err
    }
  }

  const items= [
    {
      key: '1',
      label: (
        <a href={'/profile'}>
          Profile
        </a>
      ),
    },
    {
      key: '2',
      label: (
        <p onClick={()=>{
          dispatch(logOut())
          navigate('/login')
        }
        }>
          Logout
        </p>
      ),
    }
  ];

  const getUrl=async(imageName)=>{
    if(imageName!=''){
      const res=await getPost(imageName);
   
      return res.data
    }
    return (process.env.PUBLIC_URL + '/images/profile.jpg')
    
  }

  useEffect(()=>{
      const fetchData=async()=>{
         if(userId){
          const res=await allusers()
          setuser(res.data)
         }else{
          navigate("/login")
        }
          
      }
      fetchData()
  },[])

  useEffect(() => {
    const fetchMessageUrls = async () => {
      
        const imageUrlPromises = filter.map(async (p) => {
     
          return getUrl(p.image);
          
        
      });
  
      const resolvedUrls = await Promise.all(imageUrlPromises);
      setImageUrl(resolvedUrls);
    };
  
    fetchMessageUrls();
      
      
  }, [filter]);


  useEffect(() => {
    const fetchMessageUrls = async () => {

      const imageUrlPromises = request.map(async (p) => {
     
          return getUrl(p.profilePicture);
          
        
      });
  
      const resolvedUrls = await Promise.all(imageUrlPromises);
      setImageUrl(resolvedUrls);
    };
  
    fetchMessageUrls();
  }, [request]);


  useEffect(()=>{
    const fetchData=async()=>{
       const res=await getRequest(userId);
       console.log(res.data)
       setrequest(res.data)
    }
    if(userId){
      fetchData()
    }else{
      navigate('/login')
    }
    
  },[])

  useEffect(()=>{
    const fetchData=async()=>{
      if(userId){
        const res=await getnotification(userId)
      setonline(res.data)
      }else{
        navigate('/login')
      }
    }
    fetchData()
  },[])


  const handleRead=async()=>{
    try{
        await deletenotification(userId)
        setonline([])
    }catch(err){

    }
  }

  useEffect(()=>{
    const fetchData=async()=>{
      if(userId){
        const res=await getUserProfile(userId);
        setusername(res.data.username)
        if(res.data.profilePicture!=''){
          const response=await getPost(res.data.profilePicture);
   
          setprofile(response.data)
        }else{
          
          setprofile(process.env.PUBLIC_URL + '/images/profile.jpg')
        }
       

      }else{
        navigate('/login')
      }
        
    }
    fetchData()
  },[userId])



  return (
    <div>
    <nav className="p-5 w-full bg-blue-500 flex justify-between items-center">
       <div>
       <p className='text-4xl font-extrabold text-white cursor-pointer' onClick={()=>navigate('/')}>Zeak Media</p>
       </div>
        <div className='bg-white p-2 w-1/2 hidden md:flex items-center rounded-full px-4 relative'>
            <SearchIcon className='ml-3 text-slate-500'/>
            <input type='text' placeholder='Search your friends...'  className='outline-none focus:ring-0 w-full' onChange={handleChange}/>
            {state &&<div className='absolute  bg-white top-12 h-40 overflow-y-scroll w-11/12 rounded-lg overflow-hidden p-3' style={{ boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px' }}>
                {
                 filter.length>0? filter.map((p,index)=>{
                 
                    return(
                       p.name!=username &&
                      <div className='flex my-3 items-center cursor-pointer' onClick={()=>navigate(`/user/${p.name}`)}>
                      
                      <img src={imageUrl[index]} className='rounded-full w-7 h-7 mx-3 ml-6'/>
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
        </div>
        <div className='md:flex items-center hidden '>
           <p className='mx-1 text-white'><ChatIcon onClick={()=>setIsModalOpen1(true)}/><span className='rounded-full text-xs'>{online.length}</span></p>
            <p className='mx-1 text-white'><NotificationsActiveIcon onClick={()=>setIsModalOpen(true)}/><span className='rounded-full text-xs'>{request.length}</span></p>
            {console.log(profile)}
            <Dropdown menu={{ items }} placement="bottom" arrow>
            
            <img src={profile} className='rounded-full w-10 h-10 mx-3 ml-6'/>
    </Dropdown>
     
        </div>
        <div className='md:hidden'>
          <MenuIcon className='text-white' onClick={()=>dispatch(navclickFeed())}/>
        </div>
        <Modal  open={isModalOpen1} footer={null} onCancel={()=>{setIsModalOpen1(false)}}>
         {
          online.length>0 ? online.map((p)=>{
            return (
              <>
               <div className='flex cursor-pointer'>
                 <img src={process.env.PUBLIC_URL + '/images/profile.jpg'} className='rounded-full w-7 h-7 mx-3 ml-6'/>
                 <div>
                  <p>{p.name}</p>
                  <p>Message: {p.text}</p>
                 </div>
               </div>
               <hr className='my-3'/>
              </>
              
            )
               
          })
          
          :<p className=" text-slate-600">No messages</p>
         }
         {online.length >0 && <button className='p-2 border-2 rounded-md' onClick={()=>handleRead()}>Read all</button>}
      </Modal>
        <Modal  open={isModalOpen} footer={null} onCancel={()=>{setIsModalOpen(false)}}>
         {
          request.length>0 ? request.map((p)=>{
            return (
              <>
              <div className="flex justify-between mt-5 items-center">
              <div className='flex items-center' onClick={()=>{
                navigate(`/user/${p.username}`)
                
              }}>
              <img src={process.env.PUBLIC_URL + '/images/profile.jpg'} className='rounded-full w-10 h-10 mx-3 ml-6'/>
                 <p><b>{p.username}</b></p>
              </div>
             
                 <div className='flex'>
                  <button className='p-1 bg-green-500 text-white rounded-md mx-3' onClick={()=>handleAccept(p._id)}>Accept</button>
                  <button className='p-1 bg-red-500 text-white rounded-md ' onClick={()=>handleCancel(p._id)}>Cancel</button>
                 </div>
               </div>
             
              </>
              
            )
               
          }):<p className=" text-slate-600">No notification</p>
         }
      </Modal>
    </nav>
    </div>
  )
}

export default Navbar