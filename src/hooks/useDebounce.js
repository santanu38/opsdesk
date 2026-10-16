import { useEffect,useState } from "react"

export function useDebounce(value,delay=400){
   const [debouncedValue,setDebouncedValue]=useState(value)

   useEffect(()=>{
     const timerId=setTimeout(()=>setDebouncedValue(value),delay)

     return ()=>clearTimeout(timerId)
   },[value,debouncedValue])

   return debouncedValue;
}