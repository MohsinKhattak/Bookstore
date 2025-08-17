import { createSlice } from "@reduxjs/toolkit"
import { User } from '@bookstore/shared-types';




export interface InitialValueType {
    currentUser: User | null;
    isLoading: boolean;
    error: string | null;
}

const initialValue: InitialValueType = {
    currentUser: null,
    isLoading: false,
    error: "",
};



const userSlice = createSlice({
    name: 'user',
    initialState: initialValue,
    reducers: {
        loginStart: (state) => {
            state.isLoading = true
        },
        loginSuccess: (state, action) => {
            state.isLoading = false
            state.currentUser = action.payload
            state.error = null

        },
        loginFailure: (state, action) => {
            state.isLoading = false
            state.error = action.payload
        },
        logout: (state) => {
            state.currentUser = null

        }
    }
})



export const { loginStart, loginFailure, logout, loginSuccess } = userSlice.actions

export default userSlice.reducer