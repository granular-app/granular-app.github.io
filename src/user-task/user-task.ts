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
        children: Signal<UserTask[]>;
    }) {
        this.id = opts.id;
        this.parents = opts.parents;
        this.text = opts.text;
        this.children = opts.children;
        this.status = computed(() =>
            inheritStatus(opts.children.value.map((task) => task.status.value)),
        );
    }

    static fromTasks(opts: {
        id: string;
        parents: string[];
        text: string;
        getTasks: () => UserTask[];
    }) {
        const children = computed(() =>
            opts.getTasks().filter((t) => t.parents.includes(opts.id)),
        );

        return new ParentUserTask({
            ...opts,
            children,
        });
    }

    id: string;
    parents: string[];
    text: string;
    children: Signal<UserTask[]>;
    status: ReadonlySignal<TaskStatus>;
}

export function splitTasksByStatus(tasks: UserTask[]) {
    const statusToTasks = new Map<string, UserTask[]>();

    TaskStatuses.forEach((status) => {
        const tasksWithStatus = tasks.filter(
            (task) => task.status.value === status,
        );

        statusToTasks.set(status, tasksWithStatus);
    });

    return [...statusToTasks.entries()];
}
