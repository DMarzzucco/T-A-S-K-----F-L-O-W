import axios from "axios";
import { User } from "../ts/interfaces";

const API = "http://localhost:3000/api";

export const RegisterRequest = (user: User) => {
    return axios.post(`${API}/Register`, user)
        .then(response => {
            console.log('Response', response.data)
            return response.data;
        })
        .catch(error => {
            console.error('There was an error', error)
            throw error.response.data
        })
} 
