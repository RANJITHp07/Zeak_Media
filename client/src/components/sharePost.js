import React,{useEffect} from 'react'
import { getAllConvo } from '../api/convo'

function SharePost() {
    const userId = JSON.parse(localStorage.getItem('token')) && JSON.parse(localStorage.getItem('token')).userId ;
    const [contacts,setcontact]=useState([])
    useEffect(()=>{
        const fetchData=async()=>{
         const res= await getAllConvo(userId)
         fetchData()
         }
         if(userId){
            fetchData()
         }
        
        
      },[])
  return (
    <div>

    </div>
  )
}

export default SharePost