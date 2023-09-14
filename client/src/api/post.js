import axios from 'axios';

const host="http://localhost:5500"

export const createPost=async(formData)=>{
    const res= await axios.post(`${host}/create/post`,formData)
     return res
}

export const userPosts=async(id)=>{
    const res= await axios.get(`${host}/post/${id}`)
     return res
}

export const likedPost=async(id,userId)=>{
    try{
    const res= await axios.put(`${host}/like/${id}`,{userId})
        return res
    }catch(err){
        throw err
    }
}

export const reportPost=async(id,reason)=>{
    try{
       const res= await axios.post(`${host}/post/report`,{id,reason})
       return res
    }catch(err){
        throw err
    }
}

export const getAllPost=async(id)=>{
    try{
        const res= await axios.get(`${host}/all/${id}`)
        return res
    }catch(err){
        throw err
    }
}

export const getAllsavedPost=async(userId)=>{
    try{
        const res= await axios.get(`${host}/get/savedpost`,{
            params:{
               userId:userId
            }
        })
        return res
    }catch(err){
        throw err
    }
}

export const getPost=async(img)=>{
    try{
       
       const res=await axios.get(`${host}/image/url`,{
        params:{
          imageName:img
        }
       })
       
       return res
    }catch(err){
        throw err
    }
}

export const savePost=async(id,postId)=>{
    try{
        const res=await axios.post(`${host}/user/savePost`,{id,postId})
        return res
    }catch(err){
        throw err
    }
}

export const reportedPost=async()=>{
    try{
        const res=await axios.get(`${host}/getall/reportedpost`)
        return res
    }catch(err){
        throw err
    }
}

export const blockPost=async(id)=>{
    try{
    const res=await axios.put(`${host}/block/post/${id}`)
    return res
    }catch(err){
        throw err
    }
}

export const deletePost=async(id,userId)=>{
    try{
    const res=await axios.delete(`${host}/post/delete/${id}`,{
        params:{
            userId:userId
        }
    })
    return res
    }catch(err){
        throw err
    }
}