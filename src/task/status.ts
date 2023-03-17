export const TaskStatus = {
    ToDo: 'to-do',
    Doing: 'doing',
    Done: 'done',
} as const;
export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];

export const taskStatuses = Object.values(TaskStatus);

const priorityOrder = [
    TaskStatus.Doing,
    TaskStatus.ToDo,
    TaskStatus.Done,
] as const;

export function pickParentStatus(
    statuses: TaskStatus[],
    fallbackStatus: TaskStatus = TaskStatus.ToDo,
): TaskStatus {
    if (statuses.length === 0) return fallbackStatus;

    return priorityOrder[
        Math.min(...statuses.map((s) => priorityOrder.indexOf(s)))
    ];
}

export function getOtherStatuses(status: TaskStatus) {
    return taskStatuses.filter((s) => s !== status);
}
