import { computed, ReadonlySignal, Signal } from '@preact/signals-react';
import { inheritStatus, TaskStatus, TaskStatuses } from './task-status';

export type UserTask = {
    id: string;
    parents: string[];
    text: string;
    status: Signal<TaskStatus>;
};

export class ParentUserTask implements UserTask {
    constructor(opts: {
        id: string;
        parents: string[];
        text: string;
        subtasks: Signal<UserTask[]>;
    }) {
        this.id = opts.id;
        this.parents = opts.parents;
        this.text = opts.text;
        this.subtasks = opts.subtasks;
        this.status = computed(() =>
            inheritStatus(opts.subtasks.value.map((task) => task.status.value)),
        );
    }

    static fromContext(opts: {
        id: string;
        parents: string[];
        text: string;
        getContext: () => UserTask[];
    }): ParentUserTask {
        const subtasks = computed(() =>
            opts.getContext().filter((t) => t.parents.includes(opts.id)),
        );

        return new ParentUserTask({
            ...opts,
            subtasks: subtasks,
        });
    }

    id: string;
    parents: string[];
    text: string;
    subtasks: Signal<UserTask[]>;
    status: ReadonlySignal<TaskStatus>;
}

export function splitTasksByStatus(tasks: UserTask[]) {
    const statusToTasks = new Map<TaskStatus, UserTask[]>();

    TaskStatuses.forEach((status) => {
        const tasksWithStatus = tasks.filter(
            (task) => task.status.value === status,
        );

        statusToTasks.set(status, tasksWithStatus);
    });

    return [...statusToTasks.entries()];
}
