
import { useState } from "react";
import { AuthMe } from "../../api/auth.api";
import { useEffect } from "react";
import { useContext } from "react";
import { createContext } from "react";
import { logoutUser } from "../../api/auth.api";
import apiClient from "../../api/apiClient";


import { connectSocket, disconnectSocket } from "../sockets/socket";
import { generateFcmToken } from "../utils/getFcmToken";

export const AuthContext = createContext(null)
export function AuthProvider({children}){
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

   /**
   * Restore user session on app load
   * - First tries to get current user with access token (cookie)
   * - If access token expired (401), attempts a silent refresh
   * - If refresh succeeds, retries AuthMe to restore session
   * - Only sets user to null if refresh also fails (truly logged out)
   */

   useEffect(()=>{
    const loadMe = async ()=>{
        try{
            const res = await AuthMe()
            setUser(res.data.user)
        }catch(err){
            const status = err.response?.status;

            if(status === 401){
                // Access token expired — try silent refresh
                try {
                    await apiClient.post("/auth/refresh");
                    const retryRes = await AuthMe();
                    setUser(retryRes.data.user);
                } catch (refreshErr) {
                    // Refresh failed → truly not logged in
                    setUser(null);
                }
            } else if(status === 403){
                // Forbidden (revoked token, etc.) — clear session
                setUser(null);
            } else {
                // Network error, server down, timeout, etc.
                // Do NOT clear the user — keep whatever was there (null by default)
                // This prevents PWA from logging out users on bad connections
                setUser(null);
            }
        }finally{
            setLoading(false)
        }
    }
    loadMe()
   },[])

   // Listen to `user` state to manage global connections
   useEffect(() => {
     if (user) {
       connectSocket();
       generateFcmToken();
     } else {
       disconnectSocket();
     }
   }, [user]);

    const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      setUser(null); 
    }
  };

   return(
    <AuthContext.Provider
    value={{
        user,
        loading,
        setUser,
        logout
    }}>
        {children}
    </AuthContext.Provider>
   )
}

export const useAuth = () => {
  return useContext(AuthContext);
};