import { createContext, useContext } from "react";
import { TaskRouter } from "../../ui-state/task-router";

const TaskRouterContext = createContext<TaskRouter | undefined>(undefined);

export function useTaskRouter() {
    const taskRouter = useContext(TaskRouterContext);

    if (taskRouter === undefined) {
        throw new Error('useTaskRouter must be used within a TaskRouterProvider')
    }

    return taskRouter;
}

export const TaskRouterProvider = TaskRouterContext.Provider;