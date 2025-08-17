import axios from "axios";
import config from "config/config"

const axiosInstance = axios.create({
    baseURL: `${config.BASE_URL}/api`,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
})



export default axiosInstance