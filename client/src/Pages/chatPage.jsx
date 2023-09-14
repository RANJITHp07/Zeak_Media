import React,{useRef,useState,useEffect}from 'react'
import Contact from '../components/contact'
import { io} from 'socket.io-client';
import Navbar from '../components/navbar'
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { getAllConvo } from '../api/convo';
import {useDispatch} from "react-redux"
import { Alluser, currConvo } from '../redux/features/convo';
import {getAllMessage,createMessage, uplaodFile} from "../api/message"
import { useSelector } from 'react-redux';
import { clickFeed } from '../redux/features/cross';
import { createnotification } from '../api/notification';
import { getUserProfile } from '../api/user';
import {Modal} from 'antd'
import { getPost } from '../api/post';
import { useNavigate } from 'react-router';



function ChatPage() {

  const navigate=useNavigate()
  const userId = JSON.parse(localStorage.getItem('token')) ? JSON.parse(localStorage.getItem('token')).userId : navigate("/login");
  const user=useSelector((state)=>state.chatReducer.value.currUser)
  const click=useSelector((state)=>state.crossReducer.value.cross)
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [online,setonline]=useState([])
  const socket=useRef();
  const scrollRef = useRef();
  const [typing, setTyping] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojii,setshowemojii]=useState(false)
  const [message, setMessage] = useState([]);
   const [typingTimeout, settypingTimeout] = useState(null);
   const [file,setfile]=useState(null)
   const [vedio,setvedio]=useState(false)
   const [isModelOpen,setIsModalOpen]=useState(false)
   const [imageUrl, setImageUrl] = useState(null);
   const contacts=useSelector((state)=>state.chatReducer.value.allUsers)
  const dispatch=useDispatch()

  function handleInput(e) {
    if (socket.current) {
      setNewMessage(e.target.value);
      socket.current.emit('typing-started', { senderId: userId, receiverId: user.id });

      if (typingTimeout) clearTimeout(typingTimeout);

      settypingTimeout(
        setTimeout(() => {
          socket.current && socket.current.emit('typing-stoped', { senderId: userId, receiverId: user.id });
        }, 1000)
      );
    }
  }

  const getUrl=async(imageName)=>{
    const res=await getPost(imageName);
   
    return res.data
  }

  const handleUpload=async()=>{
    const formData = new FormData();
    formData.append('file', file);
    if(file && contacts.length >0){
      const response=await uplaodFile(formData);
      await createMessage({
       conversationId:user.conversationId,
       sender:userId,
       text:response.data,
       type:vedio ?"vedio" :"photo"
    })
    socket.current.emit('sendMessage', { senderId: userId, receiverId: user.id, text:response.data });
    
    setNewMessage('');
    setMessage((prev)=>[...prev,{
      conversationId:user.conversationId,
      sender:userId,
      text:response.data,
      type:vedio ?"vedio" :"photo"
   }])
   
    }
     
  setIsModalOpen(false)
  }

  useEffect(() => {
    socket.current = io('ws://localhost:6005');
    socket.current.on('getMessage', (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage && setNewMessage('');
  }, [arrivalMessage]);


  useEffect(() => {
    if (userId && socket.current) {
      console.log("typing")
      socket.current.on('typing-started-from-server', () => setTyping(true));
      socket.current.on('typing-stoped-from-server', () => setTyping(false));
    }
  }, [userId, socket]);

  useEffect(()=>{
    const fetchData=async()=>{
     const res= await getAllConvo(userId)
     if(res.data.length>0){
      dispatch(Alluser(res.data))
      dispatch(currConvo({
       id:userId===res.data[0].members[0]._id?res.data[0].members[1]._id:res.data[0].members[0]._id,
       name:userId===res.data[0].members[0]._id?res.data[0].members[1].username:res.data[0].members[0].username,
       conversationId:res.data[0]._id
      }))
      const response=await getAllMessage(res.data[0]._id)
     
      setMessage(response.data)
     }
     
    }
    fetchData()
  },[arrivalMessage])

  const addEmoji = (e) => {
    const sym = e.unified.split("_");
    const codeArray = [];
    sym.forEach((el) => codeArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codeArray);
    setNewMessage((prev)=>prev+emoji)
  };




  useEffect(() => {
    if (userId && socket.current) {
      socket.current.emit('addUser', userId);
      socket.current.on('getUsers', (users) => {
        setonline(users)
        console.log(users)
      });
    }
  }, [userId]);

  const handleSendmessage = async () => {
    try {
      if (newMessage.trim() !== '' && socket.current && user.id && contacts.length >0) {
        
        
        socket.current.emit('sendMessage', { senderId: userId, receiverId: user.id, text: newMessage });
        await createMessage({
           conversationId:user.conversationId,
           sender:userId,
           text:newMessage,
           type:'text'
        })
        
        setNewMessage('');
        setMessage((prev)=>[...prev,{
          conversationId:user.conversationId,
          sender:userId,
          text:newMessage,
          type:'text'
       }])
       const p=online.map((p)=>p.userId)
       if(!p.includes(user.id)){
          const res= await getUserProfile(userId)
          await createnotification(user.id,res.data.username,newMessage)
       }
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (err) {
      throw err;
    }
  }

  const handlePhoto=(e)=>{
    try{
      
      const selectedFile=e.target.files[0]
      console.log(selectedFile)

      setfile(e.target.files[0])
      
      if (selectedFile) {
        setIsModalOpen(true)
        if (selectedFile.type.startsWith('video')) {
          if (selectedFile.size > 10 * 1024 * 1024) {
            setfile(null)
            message.info('Video size exceeds 10MB limit.');
            return;
          }else{
             setvedio(true)
          }
    };

   
  }
}catch(err){
  throw err
}
  }

  useEffect(() => {
  
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [message]);

  useEffect(() => {
    const fetchMessageUrls = async () => {
      const imageUrlPromises = message.map(async (p) => {
        if (p.type === 'photo' || p.type === 'vedio') {
          return getUrl(p.text);
        }
        return null; 
      });
  
      const resolvedUrls = await Promise.all(imageUrlPromises);
      setImageUrl(resolvedUrls);
    };
  
    fetchMessageUrls();
  }, [message]);
  


  return (
    <div>
    <Navbar/>
        <div className='flex'>
          <div className='w-72 hidden lg:block'>
            <Contact setmessage={setMessage}/>
            <div ref={scrollRef} />
          </div>

          {
        click &&
        <div
            className="fixed top-0 left-0 right-0 bottom-0 flex  bg-black bg-opacity-50 z-50 lg:hidden"
          >
            <Contact setmessage={setMessage}/>
          </div>
      }
          <div className='w-full h-screen justify-end'>
            <div className='bg-blue-500 w-full p-2 flex justify-between items-center'>
              <p className='text-white'>{user.name}</p>
              <button className='border-2 text-white p-2 rounded-md lg:hidden' onClick={()=>dispatch(clickFeed())}>All users</button>
            </div>
            
            <div className='w-full h-full   overflow-y-auto'>
            {
             message.length >0 ? message.map((p,index)=>{
             
                return (
                  <>
        {p.type === 'text' ? (
          <div className={p.sender === userId ? 'flex justify-end' : 'flex justify-start'}>
            <p className="bg-blue-500 p-2 m-3 rounded-lg text-white">{p.text}</p>
          </div>
        ) : (p.type === 'vedio' ? (
          <div className={p.sender === userId ? 'flex justify-end' : 'flex justify-start'}>
          
      <video src={imageUrl[index]} controls alt="img" className="my-3 h-32 w-32 md:h-72 md:w-72 mx-3 rounded-lg" />
      
          </div>
        ) : (
          <div className={p.sender === userId ? 'flex justify-end' : 'flex justify-start'}>
        
      <img src={imageUrl[index]} alt="img" className="my-3 h-32 w-32 md:h-72 md:w-72 mx-3 rounded-lg" />
     
          </div>
        ))}
        <div ref={scrollRef}></div> 
      </>
                    
                )
              }):<p className="text-8xl my-16 mx-32 font-bold text-slate-200">Open a message</p>
            }
            {typing && (
              <p className="bg-blue-500 inline text-white text-sm rounded-lg p-3 mx-3 my-5">
                Typing...
              </p>
            )}
            
            </div>
            <Modal  open={isModelOpen} footer={null} onCancel={()=>{setIsModalOpen(false)}}>
            {
               vedio ?(file && <video src={URL.createObjectURL(file)} controls alt='img' className='my-3 h-96 w-full'/>) :
                (file && <img src={URL.createObjectURL(file)} alt='img' className='my-3 h-96 w-96 mx-auto'/>)
              }
              <button className='p-2 w-full bg-blue-500 text-white' onClick={()=>handleUpload()}>Send</button>
            </Modal>
            
            <div className='my-3 px-3 py-1 flex items-center rounded-full w-11/12 mx-auto' style={{ boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px' }}>
            <SentimentVerySatisfiedIcon  className='cursor-pointer' onClick={()=>setshowemojii(!showEmojii)}/>
              
              <input type='text' className=' w-11/12 p-2 focus:outline-none' placeholder='Send your message' value={newMessage} onChange={(e) => {
                    handleInput(e);
                  }} />
              <div className='mx-2'>
                 <input type='file' accept=".jpg, .jpeg, .png, .gif, .mp4, .mov, .avi"  name='file' id='file' className='hidden' onChange={handlePhoto} />
                 <label  htmlFor="file" className="cursor-pointer  right-0">
                  <AttachFileIcon className="-rotate-45 mx-3" id="file" />
                </label>
              </div>
              
              <SendIcon onClick={()=>handleSendmessage()}/>
            </div>
            {
           showEmojii && 
           <div className=" absolute bottom-0 ">
            <Picker data={data} onEmojiSelect={addEmoji} emojiSize={20} emojiButtonSize={28} />
            </div>
         }
          </div>
           
        </div>
        <div ref={scrollRef} />
    </div>
  )
}

export default ChatPage