import React,{useState,useEffect,useMemo} from 'react'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { deletePost, getPost, likedPost, reportPost, savePost } from '../api/post';
import { createComment, deleteComment, getComment, updateComment } from '../api/comment';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { getFollowers, getUserProfile } from '../api/user';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Dropdown, message,Modal } from 'antd';
import ShareIcon from '@mui/icons-material/Share';
import { createMessage } from '../api/message';
import { getOneConvo } from '../api/convo';


function Post({post,page}) {
  


  const  userId  = JSON.parse(localStorage.getItem("token")) && JSON.parse(localStorage.getItem("token")).userId
  const [save,setsave]=useState(false)
  const [liked,setliked]=useState(true)
  const [read,setread]=useState(100)
  const [likes,setlikes]=useState(post.likes.length)
  const [user,setuser]=useState()
  const[updatecomment,setupdatecomment]=useState('')
  const[url,seturl]=useState({
    profile:post.userId.profilePicture,
    post:post.img
  })
  const[update,setupdate]=useState({
    state:false,
    id:''
  })
  const [following,setfollowing] = useState([])
  const [showComment,setshowComment]=useState(false)
  const[allcomments,setallcomments]=useState([])
  const [comment,setcomment]=useState('')
  const [isModel,setisModel]=useState(false)

 const  handleSave=async()=>{
       try{
         await savePost(userId,post._id)
         setsave(!save)
       }catch(err){
        throw err
       }
  }

  const handleReport=async(reason)=>{
      try{
          const res=await reportPost(post._id,reason)
          message.info(res.data)
      }catch(err){
        throw err
      }
  }

  const { confirm } = Modal;

const showConfirm = (id) => {
  confirm({
    title: 'Do you Want to delete the comment?',
    icon: <ExclamationCircleFilled />,
    content: '',
    onOk() {
      handleDelete(id)
    },
    onCancel() {
      console.log('Cancel');
    },
  });
};

const showConfirm1 = () => {
  confirm({
    title: 'Do you Want to delete the post?',
    icon: <ExclamationCircleFilled />,
    content: '',
    onOk() {
      handleDeletePost()
    },
    onCancel() {
      console.log('Cancel');
    },
  });
};

useEffect(()=>{
  const fetchData=async()=>{
    if(userId){
      const res=await getFollowers(userId,false)
      console.log(res.data)
        setfollowing(res.data)
   }
  }
  fetchData()
  
},[])
  

  const items= [
    {
      key: '1',
      label: (
        <p onClick={()=>handleReport("Spam")}> 
          Report as Spam
        </p>
      ),
    },
    {
      key: '2',
      label: (
        <p onClick={()=>handleReport("Violence")}>
          Report as Violence
        </p>
      ),
    },
    {
      key: '3',
      label: (
        <p onClick={()=>handleReport("Inappropriate Content")}>
          Inappropriate Content
        </p>
      ),
    },
    {
      key: '3',
      label: (
        <p onClick={()=>handleReport("Harassment")}>
          Report as Harassment
        </p>
      ),
    }
  ];

   const handleUpdateComment=async(id)=>{
    try{
      await updateComment(id,updatecomment)
    }catch(err){
      throw err
    }
   }

    useEffect(()=>{
      const fecthData=async()=>{
          try{
             const res=await getComment(post._id);
             res.data && setallcomments(res.data.comments)
          }catch(err){
            throw err
          }
      }
      fecthData()
    },[])


    useEffect(() => {
      if(userId){
        getUserProfile(userId)
        .then((response) => {
          
          setsave(response.data.savedPost.includes(post._id));
          
          setuser(response.data);
        })
        .catch((err) => {
          throw err
        });
      }
      
    }, [userId]);


      const handleComment=async()=>{
        await createComment(post._id,user.username,comment)
        setallcomments((prev)=>[...prev,{name:user.username,comment:comment}])
      }
 
  const handleDelete=async(id)=>{
    try{
       await deleteComment(post._id,id)
       setallcomments((prevComments) => {
        return prevComments.filter((post) => post._id !== id);
      });
      }
    catch(err){
      throw err
    }
  }

  useMemo(()=>{
    
    const fetchData=async()=>{

      if(url.post!=''){
       
        post.likes.includes(userId)?setliked(false):setliked(true)
        const res=await getPost(post.img);
        if(post.userId.profilePicture!=''){
          const response=await getPost(post.userId.profilePicture)
          seturl({profile:response.data,post:res.data})
        }else{
          seturl({profile:'',post:res.data})
        }
        
      }
      
    }
    fetchData()
  },[])

  const handleLike=async()=>{
    try{
       setliked(!liked)
       const res=await likedPost(post._id,userId)
       if(res.data==='The post has been liked'){
          setlikes((prev)=>prev+1)
       }else{
        setlikes((prev)=>prev-1)
       }
    }catch(err){
      
      throw err
    }
  }

  const handleUpdate=async(id)=>{
        try{
            setupdate({
              state:true,
              id:id
            })
        }catch(err){
          throw err
        }
  }

  const handleShare=async(id)=>{
    try{ 
      const res=await getOneConvo(userId,id)
      const response= await createMessage({
      conversationId:res.data._id,
        sender:userId,
        text:post.img,
        type:post.imageType
     })
     console.log(response.data,res.data)
     message.info('Post send')
     
    }catch(err){
      throw err
    }
  }

  const handleDeletePost=async()=>{
    try{
         await deletePost(post._id,userId)
         window.location.reload()
    }catch(err){
      throw err
    }
  }
  
  return (
    <div className="m-7 p-5 rounded-lg" style={{"box-shadow": "rgba(0, 0, 0, 0.35) 0px 5px 15px"}}>
    <div className="flex items-center mb-5">
    
    <img src={post.userId.profilePicture==='' ? process.env.PUBLIC_URL + '/images/profile.jpg' : url.profile} className='rounded-full w-10 h-10 mx-2'/>
    <div>
    <p>{post.userId.username}</p>
    <p className='text-xs'>{post.location}</p>
    </div>
     <p className='ml-auto'>
     {
      !page && <Dropdown menu={{ items }} placement="bottom" arrow>
           <MoreVertIcon/>
    </Dropdown>
     }
     
     </p>
    </div>
    <div>
    {
      post.imageType==='vedio'?<video src={url.post} controls alt='img' className='my-3 h-96 w-full'/>:
      <img src={url.post} className='w-full h-auto max-h-96 mb-3 cursor-pointer ' onDoubleClick={()=>{
        handleLike()
    }} />
    }
    <p className='mt-3 text-sm'>
  {post.desc.length > 100 ? (
    <>
      {post.desc.slice(0, read)}<span className='text-xs text-blue-500 cursor-pointer' onClick={()=>setread(post.desc.length)}>{read===100 ?"...Read more":''}</span>
    </>
  ) : (
    post.desc
  )}
</p>

    {
      post.hashtag.map((p)=>{
        return(
          <p className='text-blue-500 inline mx-1 text-sm mb-3'>{p}</p>
        )
      })
    }
    
    
    </div>
    

    <div className='flex justify-between'>
    <div>
    {liked ? <><FavoriteBorderIcon onClick={()=>handleLike()}/><span className='text-xs'>{likes} Likes</span></> : <><FavoriteIcon onClick={()=>handleLike()} className='text-red-600'/><span className='text-xs'>{likes} Likes</span></>}
    <ChatBubbleOutlineIcon className='mx-3' onClick={()=>setshowComment(!showComment)}/>
    <p></p>
    </div>
    <div>
      { !page ? <ShareIcon className='mx-3 cursor-pointer' onClick={()=>setisModel(true)}/> : <DeleteIcon className='mx-3 cursor-pointer' onClick={()=>showConfirm1()}/>}
      {save ? <BookmarkIcon onClick={()=>handleSave()}/>:<BookmarkBorderIcon onClick={()=>handleSave()}/> }
    </div>
    
    </div>
    {
       showComment && 
    
      <div className='my-3'>
        <p>Comments</p>
        
        {
          allcomments.length >0 && allcomments.map((p)=>{
            return (
              <>
              <div className='flex items-center justify-between'>
              <div className='flex my-3 items-center'>
                      <img src={process.env.PUBLIC_URL + '/images/profile.webp'} className='rounded-full w-7 h-7 mx-3'/>
                      <div>
                      <p className='text-xs'>{p.name}</p>
                      { (update.state && p._id===update.id) ? <input type='text' className='border-2 p-1 w-full overflow-hidden'
                      onChange={(e)=>setupdatecomment(e.target.value)}
                        onKeyPress={(e) => {
      if (e.key === 'Enter') {
        e.preventDefault(); 
        handleUpdateComment(p._id)
        setallcomments(()=>{
          return allcomments.map((post)=>{
               if(post._id==p._id){
                  post.comment=updatecomment
               }
               return post
          })
        })
        setupdate({
          state:false,
          id:''
        })
      }
    }}
                      /> : <p className='text-sm'>{p.comment}</p>}
                      </div>
                      </div>
                      <div>
                      {
                        p.name===user.username && <>
                        <EditIcon  className='text-xs mx-1 cursor-pointer' style={{ fontSize: '14px' }} onClick={()=>handleUpdate(p._id)}/>
                        <DeleteIcon className='text-xs mx-1 cursor-pointer' style={{ fontSize: '14px' }} onClick={()=>showConfirm(p._id)}/>
                        </>
                      }
                      
                    

                      </div>
                      
                      
        </div>
        <hr/>
              </>
            )
          })
        }
                      
        <div className='my-3'>
  <input
    placeholder="Add your comment"
    className='w-full border-gray-300 focus:border-none outline-none'
    value={comment}
    type='text'
    onChange={(e)=>{setcomment(e.target.value)}}
    onKeyPress={(e) => {
      if (e.key === 'Enter') {
        e.preventDefault(); 
        handleComment()
        setcomment('')
      }
    }}
  />
</div>

        
      </div>
    }
    <Modal  open={isModel} footer={null} onCancel={()=>setisModel(false)}>
       <div className="my-5">

      
            {
              following && following.map((p)=>{
                return(
                  <div className=' my-3 '>
                  <div className='flex justify-between my-3 '>
                  {console.log(user)}
                     <div className='flex items-center'>
                     <img src={process.env.PUBLIC_URL + '/images/profile.jpg'} className='rounded-full w-7 h-7 mx-3 ml-6'/>
                      <p className='text-sm'>{p.username}</p>
                     </div>
                      <button className='bg-blue-500 text-white p-2 rounded-lg' onClick={()=>handleShare(p._id)}>Send</button>
                      
                  </div>
                  <hr/>
                  </div>
                 
                )
              })
            }
            </div>
      </Modal>
    </div>
  )
}

export default Post