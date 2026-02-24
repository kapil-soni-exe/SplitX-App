
import { useState } from "react";
import { AuthMe } from "../../api/auth.api";
import { useEffect } from "react";
import { useContext } from "react";
import { createContext } from "react";


export const AuthContext = createContext(null)
export function AuthProvider({children}){
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

   /**
   * Restore user session on app load
   * - Cookie is automatically sent (httpOnly)
   * - Backend decides if user is authenticated
   */

   useEffect(()=>{
    const loadMe = async ()=>{
        try{
            const res = await AuthMe()
            setUser(res.data.user)
        }catch(err){
            setUser(null);
        }finally{
            setLoading(false)
        }
    }
    loadMe()
   },[])

   return(
    <AuthContext.Provider
    value={{
        user,
        loading,
        setUser
    }}>
        {children}
    </AuthContext.Provider>
   )
}

export const useAuth = () => {
  return useContext(AuthContext);
};