import {
    computed,
    ReadonlySignal,
    signal,
    Signal,
} from '@preact/signals-react';
import produce from 'immer';
import { nanoid } from 'nanoid';
import { TaskEnvironment } from './environment';
import { inheritStatus, TaskStatus } from './status';

export const rootTaskId = 'root';
export const generateTaskId = nanoid;

export type TaskParams = {
    environment: TaskEnvironment;
    id?: string;
    parentIds: Signal<Set<string>>;
    text: string;
    staticStatus?: Signal<TaskStatus>;
    prefersStaticStatus?: Signal<boolean>;
};

export type RootTaskParams = Omit<TaskParams, 'id' | 'parentIds'>;

export class Task {
    constructor({
        environment,
        id,
        parentIds,
        text,
        staticStatus,
        prefersStaticStatus,
    }: TaskParams) {
        this.id = id ?? generateTaskId();
        this.parentIds = parentIds;
        if (this.hasExtraParents && this.isRoot)
            throw new TaskMustHaveAtLeastOneParentError();

        this.environment = environment;
        this.text = text;
        this.parentsSignal = computed(() =>
            environment.value.filter((task) => this.parentIds.value.has(task.id)),
        );
        this.children = computed(() =>
            environment.value.filter((task) => task.parentIds.value.has(this.id)),
        );
        this.staticStatus = staticStatus ?? signal(TaskStatus.ToDo);
        this.prefersStaticStatus = prefersStaticStatus ?? signal(false);
    }

    static root(params: RootTaskParams) {
        return new Task({
            ...params,
            id: rootTaskId,
            parentIds: computed(() => new Set()),
        });
    }

    environment: TaskEnvironment;

    id: string;
    get isRoot() {
        return this.id === rootTaskId;
    }

    text: string;

    private parentIds: Signal<Set<string>>;
    parentsSignal: TaskEnvironment;
    get parents() {
        return this.parentsSignal.value;
    }

    children: TaskEnvironment;

    private dynamicStatus: ReadonlySignal<TaskStatus | null> = computed(() => {
        const memberStatuses = this.children.value.map((m) => m.statusSignal.value);

        return inheritStatus(memberStatuses);
    });
    staticStatus: Signal<TaskStatus>;

    prefersStaticStatus: Signal<boolean>;
    get usesStaticStatus() {
        return this.prefersStaticStatus.value || this.dynamicStatus.value === null;
    }
    statusSignal: ReadonlySignal<TaskStatus> = computed(() => {
        return this.usesStaticStatus
            ? this.staticStatus.value
            : (this.dynamicStatus.value as TaskStatus);
    });
    get status() {
        return this.statusSignal.value;
    }

    addParent(parentId: string) {
        if (this.id === rootTaskId) throw new RootTaskMustHaveNoParentsError();

        this.parentIds.value = produce(this.parentIds.value, (draft) => {
            draft.add(parentId);
        });
    }

    get hasExtraParents() {
        return this.parentIds.value.size > 1;
    }

    removeParent(parentId: string) {
        if (!this.hasExtraParents) throw new TaskMustHaveAtLeastOneParentError();

        this.parentIds.value = produce(this.parentIds.value, (draft) => {
            draft.delete(parentId);
        });
    }

    getAddableParents(): Task[] {
        const nestedTaskIds = [...this.getNestedTasks()].map((t) => t.id);

        const isAddable = (task: Task): boolean => {
            return !(
                task.id === this.id ||
                this.parentIds.value.has(task.id) ||
                nestedTaskIds.includes(task.id)
            );
        };

        return this.environment.value.filter(isAddable);
    }

    getNestedTasks(): Set<Task> {
        return new Set(
            this.children.value.flatMap((t) => {
                return [t, ...t.getNestedTasks()];
            }),
        );
    }
}

export interface TaskError { }
export class TaskMustHaveAtLeastOneParentError implements TaskError { }
export class RootTaskMustHaveNoParentsError implements TaskError { }
