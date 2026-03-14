
import { useState } from "react";
import { AuthMe } from "../../api/auth.api";
import { useEffect } from "react";
import { useContext } from "react";
import { createContext } from "react";
import { logoutUser } from "../../api/auth.api";
import apiClient from "../../api/apiClient";


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
            // Access token likely expired - try a silent refresh
            if(err.response?.status === 401){
                try {
                    await apiClient.post("/auth/refresh");
                    // Refresh succeeded, retry to get user info
                    const retryRes = await AuthMe();
                    setUser(retryRes.data.user);
                } catch (refreshErr) {
                    // Refresh also failed - user truly not logged in
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        }finally{
            setLoading(false)
        }
    }
    loadMe()
   },[])

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