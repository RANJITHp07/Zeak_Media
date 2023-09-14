import axios from 'axios'

const host="http://localhost:5500"

export const createConvo=async(senderId,recieveId)=>{
 
    const res=await axios.post(`${host}/conversation`,{senderId,recieveId});
    return res
}


export const getAllConvo=async(id)=>{
    const res=await axios.get(`${host}/conversation/${id}`);
    return res
}


export const getOneConvo=async(userId,id)=>{
    const res=await axios.get(`${host}/conversation/get/chat`,{
        params:{
            senderId:userId,
            recieveId:id
        }
    });
    return res
}

