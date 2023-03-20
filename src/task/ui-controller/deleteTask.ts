import { taskContext } from "../entity/context";
import { taskRouter } from "../ui-state/task-router";

export function deleteTask(id: string) {
    const isCurrentTask = id === taskRouter.taskId;
    if (isCurrentTask) taskRouter.pop();

    taskContext.delete(id);
}