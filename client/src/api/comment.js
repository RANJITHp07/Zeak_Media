import axios from 'axios';


const host="http://localhost:5500"

export const createComment=async(postId,name,comment)=>{
    try{
      const res=await axios.post(`${host}/comment`,{postId,name,comment})
      return res
    }catch(err){
        throw err
    }
}

export const getComment=async(id)=>{
    try{
     const res=await axios.get(`${host}/comments/${id}`)
     return res
    }catch(err){
        throw err
    }
}

export const updateComment=async(id,comment)=>{
    try{
        const res=await axios.put(`${host}/comment`,{id,comment})
        return res
    }catch(err){
        throw err
    }
}

export const deleteComment=async(postId,commentId)=>{
    try{
        const res=await axios.put(`${host}/comment/delete`,{postId,commentId})
        return res
    }catch(err){
        throw err
    }
}