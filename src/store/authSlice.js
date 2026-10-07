import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { axiosClient } from "../api/axiosClient"
//async thunk :handles the login api call
export const loginUser=createAsyncThunk(
    "auth/loginUser",
    async ({username,password},{rejectWithValue})=>{
        try{
            const response=await axiosClient.post("auth/login",{username,password})
            return response.data
        }catch(error){
            return rejectWithValue(error.response?.data?.message || error.message)
        }
    }
)

export const refreshAccessToken=createAsyncThunk(
    "auth/refreshAccessToken",
    async (_,{rejectWithValue})=>{
        try{
           const storedRefreshToken=localStorage.getItem("refreshToken")
              if(!storedRefreshToken){
                throw new Error("No refresh token available")
              }
              const response=await axiosClient.post("auth/refresh",{
                refreshToken:storedRefreshToken
              })
              localStorage.setItem("accessToken",response.data.accessToken)
              return response.data.accessToken
        }catch(error){
            return rejectWithValue(error.response?.data?.message || error.message)
        }
    }
)


const authSlice=createSlice({
    name:"auth",
    initialState:{
        user:null,
        accessToken:null,
        isAuthenticated:false,
        status:"idle",
        error:null,
    },
    reducers:{
        //Synchronus actions -no api calls
        logout:(state)=>{
            state.user=null
            state.accessToken=null
            state.isAuthenticated=false

        },
        setAccessToken:(state,action)=>{
            state.accessToken=action.payload
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(loginUser.pending,(state)=>{
            state.status="loading"
            state.error=null
        })
        .addCase(loginUser.fulfilled,(state,action)=>{
            state.status="succeeded"
            state.user=action.payload.user
            state.accessToken=action.payload.accessToken
            state.isAuthenticated=true
            localStorage.setItem("accessToken",action.payload.accessToken)
        })
        .addCase(loginUser.rejected,(state,action)=>{
            state.status="failed"
            state.error=action.payload || action.error.message
        })
        .addCase(refreshAccessToken.fulfilled,(state,action)=>{
            state.accessToken=action.payload
            state.isAuthenticated=true
        })
        .addCase(refreshAccessToken.rejected,(state)=>{
            state.user=null
            state.accessToken=null
            state.isAuthenticated=false
            localStorage.removeItem("accessToken")
        })
    }
})

export const {logout,setAccessToken}=authSlice.actions
export default authSlice.reducer