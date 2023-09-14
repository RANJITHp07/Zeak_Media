import axios from 'axios'

const host="http://localhost:5500"

export const createMessage=async(data)=>{
    const res=await axios.post(`${host}/message`,data)
    return res
}

export const getAllMessage=async(id)=>{
    const res=await axios.get(`${host}/messages/${id}`)
    return res
}

export const uplaodFile=async(formData)=>{
 
    const res=await axios.post(`${host}/find/image/url`,formData);
    return res
}