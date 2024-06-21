import axios, { AxiosError, AxiosResponse } from "axios";
import instance from "./instances";
import { ApiErrorResponse, User } from "../ts/interfaces";

export const RegisterRequest = (user: User) => {
    return instance.post(`/Register`, user)
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
    return instance.post(`/Login`, user)
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

export const veryToken = (): Promise<User> => {
    return instance.get(`/very`)
        .then((response: AxiosResponse<User>) => {
            console.log("Token Verifacation", response.data)
            return response.data
        })
        .catch((error) => {
            console.error("Error verifying token", error)
            if (axios.isAxiosError(error) && error.response) {
                const apiError: ApiErrorResponse = error.response.data;
                throw { response: { data: apiError, status: error.response.status } };
            } else {
                throw { errors: [{ message: "Unexpected error" }] }
            }
        })
}
