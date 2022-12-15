import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import config from "../config";
import AuthService from "../service/authService";

export const verifyUser = createAsyncThunk('user/authenticateUser',
    async (_) => {
        try {
            const response = await AuthService.kipleLogin(config.credentials.username, config.credentials.password).catch(error => error)
            return response;
        } catch (error) {
            throw error;
        }
    })

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false,
        token: null,
        error: null
    },
    reducers: {},
    extraReducers(builder) {
        builder.addCase(verifyUser.fulfilled, (state, action) => {
            const { data, code, message } = action.payload;
            if (code === "ERR_BAD_REQUEST" || code === "ERR_NETWORK") {
                state = Object.assign(state, { isLoggedIn: false, token: null, error: message })
                return
            }

            if (data && data.success === true && data.session_token != '') {
                state = Object.assign(state, { isLoggedIn: true, token: data.session_token, error: null })
            }
        })
        builder.addCase(verifyUser.rejected, (state, action) => {
            console.log(action)
        })
    },
});

export const authActions = authSlice.actions;
export default authSlice
