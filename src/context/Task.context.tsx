import { createContext, useContext, useState } from "react";
import { AuthProvI, Task, TaskContextType } from "../ts/interfaces";

export const taskContext = createContext<TaskContextType | undefined>(undefined);

export const useTask = () => {
    const context = useContext(taskContext);
    if (!context) {
        throw new Error("useTask must be used within a TaskProvider")
    }
    return context;
}

const TaskProvider: React.FC<AuthProvI> = ({ children }) => {
    const [task, setTask ] = useState< Task |[]>([])
    return (
        <taskContext.Provider value={{task}}>
            {children}
        </taskContext.Provider>
    )
}
export default TaskProvider;