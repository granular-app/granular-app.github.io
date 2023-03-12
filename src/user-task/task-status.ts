export const TaskStatuses = ['To Do', 'Doing', 'Done'] as const;
export type TaskStatus = (typeof TaskStatuses)[number];

const priorityOrder = ['Doing', 'To Do', 'Done'] as const;

export function inheritStatus(statuses: TaskStatus[]): TaskStatus {
    return priorityOrder[
        Math.min(...statuses.map((s) => priorityOrder.indexOf(s)))
    ];
}
