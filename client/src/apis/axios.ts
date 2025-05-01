import axios from "axios";


 const axiosInstance = axios.create({
  headers : {'Content-Type' : 'application/json',}
  
})

axiosInstance.interceptors.request.use(function (config) {
  const token = localStorage.getItem("token")||'';
  config.headers["authorization"] =  token;
  return config;
});

export default axiosInstance;