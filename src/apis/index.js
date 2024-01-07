import axios from "axios";
import { API_BASE_URL } from "../consts";

const axiosHttp = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

const Axios = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

const getAccessToken = () => {
  const user = JSON.parse(localStorage.getItem("userInfo"));
  return user.token || "";
};

axiosHttp.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    return {
      ...config,
      headers: {
        ...(token !== null && { Authorization: `Bearer ${token}` }),
        ...config.headers,
      },
    };
  },
  (error) => {
    return Promise.reject(error);
  }
);

// axiosHttp.interceptors.response.use(
//   (response) => {
//     //const url = response.config.url;

//     //setLocalStorageToken(token);
//     return response;
//   },
//   (error) => {
//     if (error.response.status === 401) {
//       //(`unauthorized :)`);
//       //localStorage.removeItem("persist:root");
//       //removeLocalStorageToken
//       //window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );

export default axiosHttp;
export { Axios };
