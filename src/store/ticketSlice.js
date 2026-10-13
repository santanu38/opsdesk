import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import {axiosClient} from "../api/axiosClient";
export const fetchTickets=createAsyncThunk(
    "tickets/fetchTickets",
    async(_,{rejectWithValue})=>{
        try{
          const response=await axiosClient.get("/tickets")
          return response.data
        }catch(error){
            return rejectWithValue(error.response?.data?.message || "Failed to load tickets")
        }
    }
)

const ticketSlice=createSlice({
    name:"tickets",
    initialState:{
        items:[],
        status:"idle",
        error:null,
        // filters — deliberately living in the SAME slice as the ticket data for now.
        // This is part of the problem we'll diagnose and fix later.
        statusFilter:"all",
        priorityFilter:"all",
        
    },
    reducers:{
        setStatusFilter:(state,action)=>{
            state.statusFilter=action.payload
        },
        setPriorityFilter:(state,action)=>{
            state.priorityFilter=action.payload
        }
    },
    extraReducers:(builder)=>{
       builder
       .addCase(fetchTickets.pending,(state)=>{
        state.status="loading"
       })
       .addCase(fetchTickets.fulfilled,(state,action)=>{
        state.status="succeeded"
        state.items=action.payload
       })
       .addCase(fetchTickets.rejected,(state,action)=>{
        state.status="failed"
        state.error=action.payload
       })
    }
})

export const {setStatusFilter,setPriorityFilter}=ticketSlice.actions
export default ticketSlice.reducer