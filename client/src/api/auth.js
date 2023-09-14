import axios from 'axios';

const host="http://localhost:5500"

export const register=async(userData)=>{
     const res= await axios.post(`${host}/auth/register`,userData)
     return res
}

export const sendEmailVerification=async(email,username)=>{
     console.log(email,username)
     const res= await axios.post(`${host}/auth/useremail`,{email,username})
     return res
}

export const emailVerify=async(otp,email)=>{
     try{
       const res=await axios.post(`${host}/auth/userverify`,{otp,email})
       return res
     }catch(err){
          throw err
     }
}

export const authlogin=async(email,password)=>{
     try{
        const res=await axios.post(`${host}/auth/login`,{email,password})
        return res
     }catch(err){
          
     }
}


export const userExist=async(email,username)=>{
     try{
          const res=await axios.post(`${host}/auth/exist`,{email,username})
          return res
     }catch(err){
          throw err
     }
}

export const changePassword=async(email,password)=>{
      try{
          const res=await axios.post(`${host}/auth/changepassword`,{email,password})
          return res
      }catch(err){
          throw err
      }
}