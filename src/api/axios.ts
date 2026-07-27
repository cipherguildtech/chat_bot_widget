import axios from "axios";

const api = axios.create({
    baseURL: 'https://7gv7627j-8000.inc1.devtunnels.ms',
    headers: {
        "Content-Type": "application/json",
    },
});



export default api;