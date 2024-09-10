

import axios from 'axios';
const API_SERVER = import.meta.env.VITE_API_SERVER;


const request = axios.create({
    baseURL: API_SERVER,
    headers: {
        'Content-type': 'application/json'
    }
});

export default request