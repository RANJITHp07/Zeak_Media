import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { changeToprivate, follow, privateAccount } from '../api/user';
import { message } from 'antd';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {Dropdown } from 'antd';
import { useDispatch } from 'react-redux';
import { createConvo } from '../api/convo';
import { clickFeed } from '../redux/features/cross';
import { useNavigate } from 'react-router';
import MessageIcon from '@mui/icons-material/Message';

function Personalinfo({ page,privates}) {
  const [following, setFollowing] = useState(false);
  const user = useSelector((state) => state.userReducer.value.user);
  const userId = JSON.parse(localStorage.getItem('token')).userId;
  const dispatch=useDispatch()
  const navigate=useNavigate()



  const items = [
    {
      key: '1',
      label: <p onClick={()=>{page ? createConversation() : handleSavedPost()}}>{ !page ? "Saved Post" : "Chat"}</p>,
    },
    {
      key: '2',
      label: <p onClick={ !page && handlePrivate}>{!page ? ( (user&& user.private) ? "Change to Public":"Change to Private") : "Add to close Friends"}</p>,
    },
    {
      key: '3',
      label: <p onClick={!page ? (()=>{navigate("/verifyuser")}):()=>{}}> { page ? 'Report this account' : 'Verify your account' }</p>,
    },
  ];

  const handleFollow = async () => {
    try {

      if(privates){
        const res=await privateAccount(user._id,userId);
        setFollowing(!following)
        message.info(res.data)
      }else{
        const res = await follow(userId, user._id);
      
        setFollowing(!following);
        message.info(res.data);
      }
      
    } catch (err) {
      throw err;
    }
  };

  async function createConversation(){
    try{
        await createConvo(userId,user._id)
        navigate("/chat")
    }catch(err){
      throw err
    }
  }

  async function handlePrivate(){
    try {
      const res = await changeToprivate(userId);
      
      message.info(res.data);
    } catch (err) {
      throw err;
    }
  };

  async function handleSavedPost(){
    dispatch(clickFeed())
  }

  useEffect(() => {
    if (user && user.following.includes(userId)) {
      
      setFollowing(true);
    }else if(user && user.request.includes(userId)){
     
      setFollowing(true)
    }
     else {
      setFollowing(false);
    }
  }, [user]);

  return (
    <div
      className="p-4 m-7 rounded-lg w-full"
      style={{ boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px' }}
    >
      <div className="flex justify-between">
        <p className="font-bold text-slate-500">Personal Information</p>
        <Dropdown menu={{ items }} placement="bottomRight" arrow>
          <MoreVertIcon />
        </Dropdown>
      </div>

      {user && (
        <>
          <p className="font-normal ">
            Name : <span>{user.username}</span>
          </p>
          <p className="font-normal ">
            DOB : <span>{!user.DOB ? 'Not mentioned' : user.DOB}</span>
          </p>
          <p className="font-normal ">
            Description :{' '}
            <span>{!user.desc ? 'Not mentioned' : user.desc}</span>
          </p>
          {page && (
            <div className='flex justify-end'>
            <button
              className="bg-blue-600 text-white p-2 ml-auto rounded-lg"
              onClick={() => handleFollow()}
            >
              {following ? (privates? "Request Send " : 'Following') : 'Follow'}
            </button>
            </div>
          )}
        </>
      )}
      {
        !page && 
        <div className='flex justify-end'>
        <button className='bg-green-600 text-white p-2 ml-auto rounded-lg' onClick={()=>navigate("/chat")}><MessageIcon/> Chat</button>

        </div>
      }
    </div>
  );
}

export default Personalinfo;
