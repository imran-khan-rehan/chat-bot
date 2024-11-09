// import axios from "axios";
// import { API_URL } from "../config";

// import { ACCESS_TOKEN } from "../utils/constants";

// export const axiosInstance = axios.create({
//   baseURL: API_URL,
//   withCredentials: true,
// });

// // Request interceptor
// axiosInstance.interceptors.request.use(
//   (config) => {
//     config.headers = {
//       ...config.headers,
//       Accept: "application/json",
//       "Content-Type": "application/json",
//     };

//     const token = localStorage.getItem(ACCESS_TOKEN);
//     if (token) {
//       config.headers["Authorization"] = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response interceptor
// // Response interceptor
// axiosInstance.interceptors.response.use(
//   (response) => {
//     console.log("Response:", response);
//     return response;
//   },
//   (error) => {
//     if (error.response) {
//       console.error("Error Response:", error.response);
//     } else {
//       console.error("Error Message:", error.message);
//     }
//     return Promise.reject(error);
//   }
// );

