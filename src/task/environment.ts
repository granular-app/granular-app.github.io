import { Signal } from '@preact/signals-react';
import { RootTaskParams, Task, TaskParams } from './task';

export type TaskEnvironment = Signal<Task[]>;
export class TaskEnvironmentWrapper {
    constructor(environment: TaskEnvironment) {
        this.environment = environment;
    }

    environment: TaskEnvironment;

    addRoot(params: Omit<RootTaskParams, 'environment'>) {
        const root = Task.root({
            ...params,
            environment: this.environment,
        });

        this.environment.value = [...this.environment.value, root];

        return root;
    }

    addTask(params: Omit<TaskParams, 'environment'>) {
        const task = new Task({
            ...params,
            environment: this.environment,
        });
        this.environment.value = [...this.environment.value, task];

        return task;
    }

    getTask(id: string) {
        return this.environment.value.find((task) => task.id === id)!;
    }
}
