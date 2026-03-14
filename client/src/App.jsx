import React, { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import {Toaster} from "react-hot-toast"
import { generateFcmToken } from "./utils/getFcmToken";




function App() {

  useEffect(()=>{
   generateFcmToken()
  },[])
  return ( 
    <>
    <Toaster
     position="top-right"
     reverseOrder={false}
     toastOptions={{
    style: {
      zIndex: 9999
    }
  }}
    />
    <RouterProvider router={router} />
</>
  )
}

export default App;
