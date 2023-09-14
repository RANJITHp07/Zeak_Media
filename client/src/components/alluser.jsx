import React ,{useState,useEffect} from 'react'
import { allusers, allusersDetails, blockUser } from '../api/user'
import { message,Pagination } from 'antd'
import { getPost } from '../api/post'

function Alluser() {
   
  const [user,setuser]=useState([])
  const [page,setpage]=useState(1)
  const [imageUrl,setimageUrl]=useState([])
  const [filter,setfilter]=useState([])
    useEffect(()=>{
        const fetchData=async()=>{
             const res=await allusersDetails()
             setuser(res.data)
             setfilter(res.data)
        }
        fetchData()
    },[])

    const handleBlock=async(id)=>{
        try{
         
           const res=await blockUser(id)
           message.info(res.data)
           window.location.reload();

        }catch(err){
            throw err
        }
    }

    const handleChange=(e)=>{
      if(e.target.value.length!=0 && filter.length>0){
       
       const newFilter = user.filter((value) => {
          return value.username.toLowerCase().includes(e.target.value.toLowerCase());
       });
       setfilter(newFilter)
      }
      else if(filter.length===0){
        
         setfilter(user)
      }else{
        setfilter(user)
      }
     }

    const getUrl=async(imageName)=>{
      if(imageName!=''){
        const res=await getPost(imageName);
        console.log(res.data)
        return res.data
      }
      return (process.env.PUBLIC_URL + '/images/profile.jpg')
      
    }

    useEffect(()=>{
      const fetchMessageUrls = async () => {
        
        const imageUrlPromises =filter.map(async (p) => {
            
            return getUrl(p.profilePicture);
            
          
        });
        console.log(imageUrlPromises)
    
        const resolvedUrls = await Promise.all(imageUrlPromises);
        setimageUrl(resolvedUrls);
      };
    
      fetchMessageUrls();
    },[filter])
  


  return (
<div className='mt-8'>
      <input placeholder='Search for the user' className='border-2 p-2 rounded-lg w-full mb-7' onChange={(e)=>handleChange(e)} />
      {
       filter.length >0 ? filter.slice(page * 8 - 8, page * 8).map((p,index) => {
          return (
            <div className='flex my-6 items-center rounded-lg p-4 justify-between' style={{ boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px' }}>
              <div className='flex items-center'>
                <img src={imageUrl[index]} className=' w-12 h-12 mx-3 ml-6 rounded-lg' />
                <p className=''>{p.username}</p>
              </div>
              <div>
                <button className='bg-green-700 text-white p-2 rounded-lg' onClick={() => handleBlock(p.username)}>{p.block ?"unBlock":"Block"}</button>
              </div>
            </div>
          )
        }) :<p className='text-xl'>No such user</p>
      }
      <div className='flex justify-center '>
      <Pagination defaultCurrent={0} total={user.length}   onChange={(e) => {
              setpage(e);
            }}/>
      </div>
      
    </div>
  )
}

export default Alluser