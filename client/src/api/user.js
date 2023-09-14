import axios from 'axios';

const host="http://localhost:5500"

export const getUserProfile=async(id)=>{
    try{
         const res=await axios.get(`${host}/user/${id}`)
        return res
    }catch(err){
        throw err
    }
}


export const updatePictures = async (type, file, id) => {
  try {
 
    const formData = new FormData();
    formData.append('type', type);
    formData.append('file', file);
    const res = await axios.put(`${host}/user/update_profile/${id}`, formData);
    return res;
  } catch (err) {
    throw err;
  }
};

export const updateProfile=async(id,update)=>{
       try{
        const res = await axios.put(`${host}/user/${id}`,{update});
        return res;
       }catch(err){
        throw err
       }
}

export const allusers = async () => {
  try {
    const res = await axios.get(`${host}/user/get/allusers`, {
      params: {
        type: 'filter'
      }
    });
    return res;
  } catch (err) {
    throw err;
  }
};

export const allusersDetails = async () => {
  try {
    const res = await axios.get(`${host}/user/get/allusers`, {
      params: {
        type: 'user'
      }
    });
    return res;
  } catch (err) {
    throw err;
  }
};

export const follow=async(id,userId)=>{
  try{
      const res=await axios.put(`${host}/${id}/follow`,{userId:userId})
      return res
  }catch(err){
    throw err
  }
}

export const changeToprivate=async(id)=>{
  try{
    const res=await axios.put(`${host}/private/${id}`)
    return res
  }catch(err){
    throw err
  }
}

export const blockUser=async(id)=>{
  try{
     console.log(id)
     const res=await axios.put(`${host}/user/block/${id}`)
     return res

  }catch(err){
    throw err
  }
}

export const privateAccount=async(id,userId)=>{
  try{
      const res=await axios.put(`${host}/user/accept/id`,{id,userId})
      return res
  }catch(err){
    throw err
  }
}


export const getRequest=async(id)=>{
  try{
      const res=await axios.get(`${host}/user/accept/id/${id}`)
      return res
  }catch(err){
    throw err
  }
}


export const deleteRequest=async(id,userId)=>{
  try{
      const res=await axios.put(`${host}/user/delete/id`,{id,userId})
      return res
  }catch(err){
    throw err
  }
}

export const verifyUseraccount=async(id,certificate)=>{
  try{
  const res=await axios.put(`${host}/user/account/verify`,{id,certificate})
  return res
  }catch(err){
    throw err
  }
}

export const getverifyUseraccount=async()=>{
  try{
  const res=await axios.get(`${host}/user/account/verify`)
  return res
  }catch(err){
    throw err
  }
}

export const postverifyUseraccount=async(data)=>{
  try{
  const res=await axios.post(`${host}/user/account/verify`,data)
  return res
  }catch(err){
    throw err
  }
}

export const getFollowers=async(id,type)=>{
  try{
  const res=await axios.get(`${host}/user/get/followers`,{
    params:{
      id:id,
      type:type
    }
  })
  return res
  }catch(err){
    throw err
  }
}


