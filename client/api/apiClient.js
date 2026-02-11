import axios from "axios"

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
  withCredentials:true
})


apiClient.interceptors.request.use((config) => {
  return config;
});


// REFRESH CONTROL VARIABLE
let isRefresh = false
let failedQue=[]

const processQueue=(error)=>{
  failedQue.forEach(({resolve,reject})=>{
    error? reject(error): resolve()
  });
  failedQue=[]
}

// RESPONSE INTERCEPTOR
apiClient.interceptors.response.use(
  (response)=>response,
  
  async (error)=>{
    const originalRequest =error.config

     // access token expired -> try refresh
     if(
      error.response?.status===401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")
    ){
      originalRequest._retry = true;

      // if Refresh already in process then wait
      if(isRefresh){
        return new Promise((resolve, reject) => {
          failedQue.push({resolve,reject})
        }).then(()=>apiClient(originalRequest))
      }

       isRefresh = true;

        try {
        //  refresh token call
        await apiClient.post("/auth/refresh");

        // Retry all waiting
        processQueue(null);

        return apiClient(originalRequest);
      } catch (err) {
        processQueue(err);
        return Promise.reject(err);
      } finally {
        isRefresh = false;
      }
    }
      return Promise.reject(error);
    
  } 
)

export default apiClient;