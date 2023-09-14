import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: {
        post:{}
    }
};

export const report= createSlice({
    name: "reportPost",
    initialState,
    reducers: {
       getPost:(state,action)=>{
            state.value.post=action.payload
       }
          
    }
});

export const {getPost} = report.actions;
export default report.reducer;
