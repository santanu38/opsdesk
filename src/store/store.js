import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice"
import ticketsReducer from "./ticketSlice"

import { persistReducer ,persistStore} from "redux-persist";

import storageModule from "redux-persist/lib/storage";

const storage = storageModule.default ?? storageModule;

console.log("Storage:", storage);
console.log("getItem:", storage?.getItem);
console.log("setItem:", storage?.setItem);


const authPersistConfig={
  key:"auth",
  storage
}

const persisitedAuthReducer=persistReducer(authPersistConfig,authReducer)

export const store=configureStore({
    reducer:{
      auth:persisitedAuthReducer,
      tickets:ticketsReducer,
    },
    middleware:(getDefaultMiddleware)=>
    getDefaultMiddleware({
      serializableCheck:{
        ignoredActions:["persist/PERSIST", "persist/REHYDRATE"]
      }
    })
})

export const persistor=persistStore(store)


