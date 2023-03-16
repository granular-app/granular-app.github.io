import { Signal } from '@preact/signals-react';
import {
    RootTaskParams,
    Task,
    TaskMustHaveAtLeastOneParentError,
    TaskParams,
} from './task';

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

    deleteTask(id: string) {
        const task = this.getTask(id);

        if (task.isRoot) throw new EnvironmentMustHaveRootTaskError();

        task.children.value.forEach((child) => {
            try {
                child.removeParent(id);
            } catch (error) {
                const isOrphan = error instanceof TaskMustHaveAtLeastOneParentError;
                if (isOrphan) {
                    this.deleteTask(child.id);
                }
            }
        });

        this.environment.value = this.environment.value.filter((t) => t.id !== id);
    }
}

export interface TaskEnvironmentError { }
export class EnvironmentMustHaveRootTaskError implements TaskEnvironmentError { }
