import React, { useState } from 'react';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import TagIcon from '@mui/icons-material/Tag';
import { Modal,message} from "antd"
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { createPost } from '../api/post';
import { useNavigate } from 'react-router';

function Upload({setPosts}) {
  const [file, setFile] = useState(null);
  const navigate=useNavigate()
  const [showEmojii, setShowEmojii] = useState(false);
  const userId = JSON.parse(localStorage.getItem('token')) ? JSON.parse(localStorage.getItem('token')).userId : navigate("/login");
  const [messages, setMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [location,setlocation]=useState('');
  const [hashtag,sethashtag]=useState('')
  const [tag,settag]=useState([])
  const [vedio,setvedio]=useState(false)

  const handleOk=()=>{
    setIsModalOpen(false);
    const t=hashtag.split(' ').filter((p)=>p[0]==="#")
     settag(t)
  }



  const handleShare=async()=>{
    try{
        if(file){
           let post={};
           if(vedio){
             post.imageType='vedio'
           }else{
            post.imageType='photo'
           }
           post={...post,userId:userId,hastag:tag,desc:messages,location}
           const formData = new FormData();
           formData.append('file', file);
           formData.append('data', JSON.stringify(post));
          const res= await createPost(formData)     
           setFile(null)
           setMessage('')
           window.location.reload();
           setPosts((prev)=>[...prev,res.data])
        }
    }catch(err){
      throw err
    }
  }

  const addEmoji = (e) => {
    const sym = e.unified.split('_');
    const codeArray = [];
    sym.forEach((el) => codeArray.push('0x' + el));
    let emoji = String.fromCodePoint(...codeArray);
    console.log(emoji)
    setMessage((prev) => prev + emoji);
  };

  const handleFileChange = (e) => {
    const selectedFile=e.target.files[0]
    setFile(e.target.files[0])
    if (selectedFile) {
      if (selectedFile.type.startsWith('video')) {
        if (selectedFile.size > 10 * 1024 * 1024) {
          setFile(null)
          message.info('Video size exceeds 10MB limit.');
          return;
        }else{
           setvedio(true)
        }
  };
   
}
  }

  return (
    <div className="m-7 p-5 rounded-lg" style={{ boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px' }}>
      <input type="text" placeholder="Enter your description" className="w-full outline-none my-3" value={messages} onChange={(e)=>setMessage(e.target.value)} />
      {
         (vedio && file) ? <video src={URL.createObjectURL(file)} controls alt='img' className='my-3 h-96 w-full'/> :
         (file &&<div>
         <img src={URL.createObjectURL(file)} alt='img' className='my-3 h-96 w-full'/>
         {
          tag.map((p)=>{
            return (
              <p className='my-2 text-blue-700 inline'>{p} </p>
            )
          })
         }
         </div> )
      }
      <div className="flex items-center justify-between">
        <div>
          <input type="file"  accept=".jpg, .jpeg, .png, .gif, .mp4, .mov, .avi" className="hidden" name="file"  id="file" onChange={handleFileChange} />
          <label htmlFor="file">
            <AddToPhotosIcon className="text-red-400 cursor-pointer hover:text-3xl" /> Upload
          </label>
          <label className="mx-3" onClick={()=>setIsModalOpen(true)}>
            <LocationOnIcon className="text-green-900 hover:text-3xl" /> Location
          </label>
          <label>
            <EmojiEmotionsIcon className="text-yellow-400 hover:text-3xl" onClick={() => setShowEmojii(!showEmojii)} /> Emojii
          </label>
          {showEmojii && file && (
            <div className="absolute ">
              <Picker data={data} onEmojiSelect={addEmoji} emojiSize={20} emojiButtonSize={28} />
            </div>
          )}
          <label className="mx-3" onClick={()=>setIsModalOpen(true)}>
            <TagIcon className="text-blue-500 hover:text-3xl" /> HashTag
          </label>
        </div>
        <div>
          <button className="bg-green-700 p-2 rounded-lg text-white" onClick={()=>handleShare()}>Share</button>
        </div>
      </div>
      <Modal title="Enter the details" open={isModalOpen} onOk={handleOk} onCancel={()=>setIsModalOpen(false)}>
      <input className=" w-full border-2 rounded-lg p-2 border-slate-300 my-2" placeholder="Enter your location" onChange={(e)=>setlocation(e.target.value)}/>
        <textarea className="w-full border-2 rounded-lg p-2 border-slate-300" placeholder="Enter your hashtags ( put space between the hashtags and start with #)" onChange={(e)=>sethashtag(e.target.value)}/>
        
      </Modal>
      
    </div>
  );
}
 

export default Upload;
