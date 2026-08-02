import axios from "axios";

const api = axios.create({
    // baseURL: 'https://prn75417-8000.inc1.devtunnels.ms',
    baseURL: 'http://127.0.0.1:8000',
    // baseURL: 'https://7gv7627j-8000.inc1.devtunnels.ms',
    headers: {
        "Content-Type": "application/json",
    },
});



export default api;