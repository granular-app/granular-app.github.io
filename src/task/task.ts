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
        if (parentIds.value.size === 0 && id !== rootTaskId)
            throw Error(
                'All tasks, except the root task, must have at least 1 group.',
            );

        this.environment = environment;
        this.id = id ?? generateTaskId();
        this.text = text;
        this.parentIds = parentIds;
        this.parents = computed(() =>
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
    text: string;
    private parentIds: Signal<Set<string>>;
    parents: TaskEnvironment;
    children: TaskEnvironment;

    private dynamicStatus: ReadonlySignal<TaskStatus | null> = computed(() => {
        const memberStatuses = this.children.value.map((m) => m.status.value);

        return inheritStatus(memberStatuses);
    });
    staticStatus: Signal<TaskStatus>;

    prefersStaticStatus: Signal<boolean>;
    get usesStaticStatus() {
        return this.prefersStaticStatus.value || this.dynamicStatus.value === null;
    }
    status: ReadonlySignal<TaskStatus> = computed(() => {
        return this.usesStaticStatus
            ? this.staticStatus.value
            : (this.dynamicStatus.value as TaskStatus);
    });

    addParent(parentId: string) {
        if (this.id === rootTaskId) throw new Error("Root task can't have parents");

        this.parentIds.value = produce(this.parentIds.value, (draft) => {
            draft.add(parentId);
        });
    }

    get canRemoveParents() {
        return this.parentIds.value.size > 1;
    }

    removeParent(parentId: string) {
        if (!this.canRemoveParents) throw new Error("Can't remove parents");

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
