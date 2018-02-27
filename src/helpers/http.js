import axios from 'axios';

let axiosInstance = axios.create({
  baseURL: 'http://localhost'
});

export default axiosInstance;
