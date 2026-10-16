import { useDispatch ,useSelector} from "react-redux";
import { useEffect,memo,useMemo ,useState} from "react";
import { fetchTickets,setStatusFilter,setPriorityFilter } from "../store/ticketSlice";
import { useDebounce } from "../hooks/useDebounce";


// Deliberately NOT memoized yet — every ticket row is a plain function component.
// function TicketRow({ticket}){
//      console.log(`[${new Date().toLocaleTimeString()}] Rendering TicketRow:`, ticket.id)
//    return(
//       <div className="bg-slate-800 p-3 rounded mb-2 flex justify-between">
//         <div className="">
//             <p className="text-white text-sm">{ticket.title}</p>
//             <p className="text-slate-400 text-xs">{ticket.assignee}</p>
//         </div>
//         <div className="text-right">
//            <span className="text-xs text-slate-300">{ticket.status}</span>
//            <br />
//            <span className="text-xs text-slate-500">{ticket.priority}</span>
//         </div>
//    </div>
//    )
  
// }

//optimised version of TicketRow using memoization to prevent unnecessary re-renders when props haven't changed.
const TicketRow=memo(
    function TicketRow({ticket}){
    //  console.log(`[${new Date().toLocaleTimeString()}] Rendering TicketRow:`, ticket.id)
   return(
      <div className="bg-slate-800 p-3 rounded mb-2 flex justify-between">
        <div className="">
            <p className="text-white text-sm">{ticket.title}</p>
            <p className="text-slate-400 text-xs">{ticket.assignee}</p>
        </div>
        <div className="text-right">
           <span className="text-xs text-slate-300">{ticket.status}</span>
           <br />
           <span className="text-xs text-slate-500">{ticket.priority}</span>
        </div>
   </div>
   )
  
}
)

function TicketPage(){
    const dispatch=useDispatch();

    const {items,status,statusFilter,priorityFilter}=useSelector((state)=>state.tickets)

     const [search,setSearch]=useState("")
     const debouncedSearch=useDebounce(search,400)

    useEffect(()=>{
      const request=dispatch(fetchTickets({search:debouncedSearch || undefined}))
      return ()=>request.abort()
    },[dispatch,debouncedSearch])
    
// const filteredTickets=items.filter((t) => {
//     if (statusFilter !== "all" && t.status !== statusFilter) return false
//     if (priorityFilter !== "all" && t.priority !== priorityFilter) return false
//     return true
// })
   const filteredTickets =useMemo(
    ()=>
     items.filter((t) => {
    if (statusFilter !== "all" && t.status !== statusFilter) return false
    if (priorityFilter !== "all" && t.priority !== priorityFilter) return false
    return true
  })
  ,[items,statusFilter,priorityFilter])

//   function handleSearchChange(e){
//      const value=e.target.value
//      setSearch(value)
//        dispatch(fetchTickets({search:value}))
//   }

    
    
    return(
        <div className="min-h-screen bg-slate-900 p-8">
          <h1 className="text-2xl font-bold text-white mb-4">Tickets</h1>

            <input
                value={search}
                onChange={(e)=>setSearch(e.target.value)}
                placeholder="Search tickets (try typing 'payment' quickly)"
                className="w-full bg-slate-700 text-white p-2 rounded mb-4 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex gap-4 mb-4">
                <select
                value={statusFilter}
                onChange={(e) => dispatch(setStatusFilter(e.target.value))}
                className="bg-slate-700 text-white p-2 rounded"
                >
                <option value="all">All Statuses</option>
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                </select>

                <select
                value={priorityFilter}
                onChange={(e) => dispatch(setPriorityFilter(e.target.value))}
                className="bg-slate-700 text-white p-2 rounded"
                >
                <option value="all">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                </select>
            </div>

            <p className="text-slate-400 text-sm mb-2">
                {filteredTickets.length} tickets {status === "loading" && "(loading...)"}
            </p>

            <div>
                {filteredTickets.slice(0, 50).map((ticket) => (
                <TicketRow key={ticket.id} ticket={ticket} />
                ))}
            </div>
        </div>
    )
}
export default TicketPage