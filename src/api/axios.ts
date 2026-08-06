import axios from "axios";

const api = axios.create({
    // baseURL: 'https://prn75417-8000.inc1.devtunnels.ms',
    // baseURL: 'https://7gv7627j-8000.inc1.devtunnels.ms',
    baseURL: 'https://ragchatbot-production-0643.up.railway.app',
    // baseURL: 'https://ragchatbot-production-0643.up.railway.app',
    // baseURL: 'http://127.0.0.1:8000',
    headers: {
        "Content-Type": "application/json",
    },
});



export default api;