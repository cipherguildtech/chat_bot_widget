import axios from "axios";

const api = axios.create({
    baseURL: 'https://chat-bot-widget-taupe.vercel.app',
    headers: {
        "Content-Type": "application/json",
    },
});



export default api;