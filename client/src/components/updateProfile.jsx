import React,{useState,useEffect} from 'react'
import { useSelector } from 'react-redux';
import { DatePicker, message,} from 'antd';
import moment from 'moment';
import { updatePictures,updateProfile} from '../api/user';
import { useDispatch } from 'react-redux';
import { userUpdate } from '../redux/features/user';

function UpdateProfile() {

    const  userId  = JSON.parse(localStorage.getItem("token")).userId
    const [file,setfile]=useState(null)
    const user=useSelector((state)=>state.userReducer.value.user);
    const [profile,setprofile]=useState()
    const dispatch=useDispatch()

    useEffect(()=>{
        setprofile({
            username:user.username,
            DOB:user.DOB,
            desc:user.desc
        })
    },[])

    const updatedProfile=async()=>{
        try{
            const formattedDOB = moment(profile.DOB).format('D-M-YYYY');
            const p={...profile,DOB:formattedDOB}
            const res=await updateProfile(userId,p)
            message.success(res.data)
            window.location.reload();
            dispatch(userUpdate(p))
             
            
      
        }catch(err){
            throw err
        }
    }

    const handleFileChange=async(e)=>{
        try{
            if(e.target.files[0]){
                
                  const res=await updatePictures('background',e.target.files[0],userId)
                  return res
            }
            
        }catch(err){
            throw err
        }
    }

    const handleprofileChange=async(e)=>{
        try{
            if(e.target.files[0]){
                setfile(e.target.files[0])
                const res=await updatePictures('profile',e.target.files[0],userId)
                return res
          }
        }catch(err){
            throw err
        }
    }

  return (
    <div>
        <p className='font-semibold'>Update</p>
        {
           profile && <>
        <div className='flex justify-center'>
        {
           file ? <img src={URL.createObjectURL(file)} alt='img' className='rounded-full h-32 w-32'/> : <img src={user.profilePicture===''?( process.env.PUBLIC_URL + '/images/profile.jpg' ):user.profilePicture} alt='profile' className='rounded-full h-32 w-32'/>
           
        }
            
        </div>
        <div className='flex justify-center'>
            <label className='p-2 border-2 rounded-full w-full m-2 text-center cursor-pointer' htmlFor='pfile'>Edit Profile Picture</label>
            <input type='file' className='hidden' id='pfile' name='file' onChange={handleprofileChange}/>
            <label className='p-2 border-2 rounded-full w-full m-2 text-center cursor-pointer' htmlFor='bfile'>Edit Background Picture</label>
            <input type='file' className='hidden' id='bfile' name='file' onChange={handleFileChange}/>
        </div>
        <div className='grid my-2'>
            <label>Username</label>
            <input placeholder='Update your username' className='p-2 border-2 rounded-lg' type='text' defaultValue={profile.username} onChange={(e)=>setprofile({...profile,username:e.target.value})} />
        </div>
        <div className='grid my-2'>
            <label>DOB</label>
            <DatePicker
              renderExtraFooter={() => 'extra footer'}
              className='w-full'
              value={profile.DOB ? moment(profile.DOB) : null} 
              onChange={(date) => setprofile({ ...profile, DOB: date })}
              format="D-M-YYYY" 
            />
        </div>
        <div className='grid my-2'>
            <label>Description</label>
            <textarea placeholder='Update your description' className='w-full h-32 border-2 p-2 rounded-md' defaultValue={profile.desc} onChange={(e)=>setprofile({...profile,desc:e.target.value})} />
        </div>
        <button className='p-2 bg-blue-500 text-white rounded-md' onClick={()=>updatedProfile()}>Update</button>
        </>
        }
    </div>
  )
}

export default UpdateProfile