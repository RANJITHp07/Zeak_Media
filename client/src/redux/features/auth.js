import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: {
        userId: '',
        token: "",
        isLoggedIn: false
    }
};

export const auth = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logOut: () => {
            localStorage.removeItem("token")
            return initialState;
        },

        logIn: (state, action) => {
            const { userId, token } = action.payload;
            localStorage.setItem("token", JSON.stringify({ userId, token }));
              state.value={
                userId,
                token,
                isLoggedIn: true
              
            };
          }
          
          
    }
});

export const { logOut, logIn } = auth.actions;
export default auth.reducer;
