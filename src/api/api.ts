import axios, { AxiosError } from "axios";
import { ApiErrorResponse, User } from "../ts/interfaces";

const API = "http://localhost:3000/api";

export const RegisterRequest = (user: User) => {
    return axios.post(`${API}/Register`, user)
        .then(response => {
            console.log('Response', response.data)
            return response.data;
        })
        .catch(error => {
            console.error('There was an error', error)
            if (axios.isAxiosError(error) && error.response) {
                const apiError: ApiErrorResponse = error.response.data;
                throw { response: { data: apiError, status: error.response.status } };
            } else {
                throw { errors: [{ message: "Unexpected Error" }] };
            }
        })
}

export const LoginRequest = (user: User) => {
    return axios.post(`${API}/Login`, user)
        .then(response => {
            console.log('Response', response.data)
            return response.data;
        })
        .catch(error => {
            console.error('There was an error ', error)
            if (axios.isAxiosError(error) && error.response) {
                const apiError: AxiosError = error.response.data;
                throw { response: { data: apiError, status: error.response.status } }
            } else {
                throw { errors: [{ message: "Unexpected Error" }] }
            }
        })
}
