import { computed, effect, signal, Signal } from '@preact/signals-react';
import produce from 'immer';
import { taskContext } from '../task/context';
import { rootTaskId } from '../task/task';

export class TaskRouter {
    constructor(path: Signal<string[]>) {
        this.internalPathState = path;

        effect(() => this.ensureConsistency());
    }

    private internalPathState: Signal<string[]>;
    get internalPath() {
        return this.internalPathState.value;
    }

    private pathState = computed(() => [rootTaskId, ...this.internalPath]);
    get path() {
        return this.pathState.value;
    }

    private taskIdState = computed(() => {
        return this.path[this.path.length - 1];
    });
    get taskId() {
        return this.taskIdState.value;
    }

    private taskState = computed(() => {
        return taskContext.get(this.taskId);
    });
    get task() {
        return this.taskState.value;
    }

    get depth() {
        return this.internalPath.length;
    }

    push(id: string) {
        this.internalPathState.value = [...this.internalPath, id];
    }

    pop(n: number = 1) {
        this.internalPathState.value = produce(this.internalPath, (draft) => {
            draft.splice(this.depth - n);
        });
    }

    setDepth(depth: number) {
        if (depth >= this.depth) throw Error();

        this.internalPathState.value = this.internalPath.slice(0, depth);
    }

    viewTask(id: string) {
        this.internalPathState.value = this.buildPathTo(id);
    }

    buildPathTo(id: string) {
        const result = [id];

        while (true) {
            const parent = taskContext.get(result[0]);

            if (parent.isChildOfRoot) break;

            result.splice(0, 0, parent.parents[0].base.id);
        }

        return result;
    }

    get isConsistent() {
        return (
            (this.task.isRoot && this.internalPath.length === 0) ||
            (this.task.isChildOfRoot && this.internalPath.length === 1) ||
            (!this.task.isChildOfRoot && this.internalPath.length !== 1)
        );
    }

    ensureConsistency() {
        if (!this.isConsistent) {
            this.viewTask(this.task.base.id);
        }
    }
}

export const taskRouter = new TaskRouter(signal([]));
