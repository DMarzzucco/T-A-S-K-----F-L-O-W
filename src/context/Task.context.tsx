import { createContext, useContext } from "react";
import { AuthProvI, TaskContextType } from "../ts/interfaces";

export const taskContext = createContext<TaskContextType | undefined>(undefined);

export const useTask = () => {
    const context = useContext(taskContext);
    if (!context) {
        throw new Error("useTask must be used within a TaskProvider")
    }
    return context;
}

const TaskProvider: React.FC<AuthProvI> = ({ children }) => {
    return (
        <taskContext.Provider value={{}}>
            {children}
        </taskContext.Provider>
    )
}
export default TaskProvider;