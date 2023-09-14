import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth"
import userReducer from './features/user'
import crossReducer from './features/cross'
import chatReducer from './features/convo'
import reportReducer from './features/convo'

export const store=configureStore({
    reducer:{
       authReducer,
       userReducer,
       crossReducer,
       chatReducer,
       reportReducer
    }
})

