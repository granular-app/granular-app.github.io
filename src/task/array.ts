import { TaskStatus, taskStatuses } from './status';
import { Task } from './task';

export class TaskArray {
    constructor(array: Task[]) {
        this.array = array;
    }

    array: Task[];

    splitByStatus(): [TaskStatus, ...Task[]][] {
        const result: [TaskStatus, ...Task[]][] = [];

        taskStatuses.forEach((status) => {
            result.push([
                status,
                ...this.array.filter((t) => t.status.value === status),
            ]);
        });

        return result;
    }
}
