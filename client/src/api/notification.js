import axios from 'axios';


const host="http://localhost:5500"

export const createnotification=async(userId,name,text)=>{
    const res=await axios.post(`${host}/create/notification`,{userId,name,text})
    return res
}

export const getnotification=async(id)=>{
    const res=await axios.get(`${host}/create/notification/${id}`)
    return res
}

export const deletenotification=async(id)=>{
    const res=await axios.delete(`${host}/create/notification/${id}`)
    return res
}