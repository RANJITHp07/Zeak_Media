import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: {
        user:null
    }
};

export const user = createSlice({
    name: "user",
    initialState,
    reducers: {
        userDetail:(state,action)=>{
            state.value={
                user:action.payload
            }
        },

        userUpdate:(state,action)=>{
            state.value={
                ...state.value,DOB:action.payload.DOB,username:action.payload.username,desc:action.payload.desc
            }
        }
    }
});

export const { userDetail,userUpdate} = user.actions;
export default user.reducer;
