import apiClient from "./apiClient";

// Stats
export const getProfileStats = () =>{
 return apiClient.get("/profile/stats");
}

// update()
export const updateProfile=(data)=>{
    return apiClient.patch("/profile/edit",data)
}