import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: {
        currUser:{
            id:'',
            name:"",
            conversationId:''
        },
        allUsers:[]
    }
};

export const chat= createSlice({
    name: "chat",
    initialState,
    reducers: {
       Alluser:(state,action)=>{
         state.value.allUsers=action.payload
       },

       currConvo:(state,action)=>{
        state.value.currUser={
            id:action.payload.id,
            name:action.payload.name,
            conversationId:action.payload.conversationId
        }
       }
          
    }
});

export const { Alluser,currConvo} = chat.actions;
export default chat.reducer;
