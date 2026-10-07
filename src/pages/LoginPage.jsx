import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { loginUser } from "../store/authSlice"

function LoginPage() {
    const [username,setUsername]=useState("")
    const [password,setPassword]=useState("")

    const dispatch = useDispatch()
   const navigate = useNavigate()
   const { status, error } = useSelector((state) => state.auth)


     async function handleSubmit(e){
         e.preventDefault()
         const resultAction=await dispatch(loginUser({username,password}))
         console.log('reach1');
         
         if(loginUser.fulfilled.match(resultAction)){
          console.log('reach2');
          
             navigate("/dashboard")
         }
         console.log('reach3');
         
     }
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <form 
      onSubmit={handleSubmit} 
      className="bg-slate-800 p-8 rounded-lg w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-white mb-4">OpsDesk Login</h1>

        <div>
          <label htmlFor="username" className="block text-sm text-slate-300 mb-1">Username</label>
          <input
            id="username"
            value={username}
             onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 rounded bg-slate-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm text-slate-300 mb-1">Password</label>
          <input
            id="password"
            type="password"
            value={password}
             onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 rounded bg-slate-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

         {error && <p className="text-red-400 text-sm">{error}</p>} 

        <button
          type="submit"
           disabled={status === "loading"}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2 rounded"
        >
          {status === "loading" ? "Logging in..." : "Log In"} 
        </button>
      </form>
    </div>
  )
}

export default LoginPage