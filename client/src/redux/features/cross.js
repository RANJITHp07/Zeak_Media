import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: {
        cross:false,
        navcross:false
    }
};

export const cross= createSlice({
    name: "cross",
    initialState,
    reducers: {
        clickFeed:(state,action)=>{
            state.value.cross=! state.value.cross
        },

        navclickFeed:(state,action)=>{
            state.value.navcross=! state.value .navcross
        }
        
    }
});

export const { clickFeed,navclickFeed } = cross.actions;
export default cross.reducer;
