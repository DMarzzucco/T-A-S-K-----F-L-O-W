// import axios, { AxiosError, AxiosResponse } from "axios";
import instance from "./instances";
import { Task } from "../ts/interfaces";

export const getAllTaskRequest = () => {
    return instance.get("/task")
        .then(response => {
            return response.data
        })
        .catch((error) => {
            console.error(error)
            throw error
        })


}
export const getTaskbyIdRequest = (id: Task) => {
    return instance.get(`/tasl/${id.task._id}`)
        .then(response => {
            return response.data
        })
        .catch((error) => {
            console.error(error)
            throw error
        })
}
export const createTask = (task: Task) => {
    return instance.post('/form', task)
        .then(response => {
            return response.data
        })
        .catch((error) => {
            console.error(error)
            throw error
        })
}
export const updateTask = (id: Task, task: Task) => {
    return instance.put(`/form/${id.task._id}`, task)
        .then(response => {
            return response.data
        })
        .catch((error) => {
            console.error(error)
            throw error
        })
}
export const delteTask = (id: Task) => {
    return instance.delete(`/task/${id.task._id}`)
        .then(response => {
            return response.data
        })
        .catch((error) => {
            console.error(error)
            throw error
        })
}