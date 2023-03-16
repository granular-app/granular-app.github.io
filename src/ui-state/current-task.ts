import { computed, Signal, signal } from '@preact/signals-react';
import produce from 'immer';
import { environment } from '../task/all-tasks';
import { rootTaskId } from '../task/task';

class TaskRouter {
    constructor(path: Signal<string[]> | string[] = [rootTaskId]) {
        this.pathSignal = path instanceof Signal ? path : signal(path);

        if (this.pathSignal.value.length === 0) throw Error();
    }

    private pathSignal: Signal<string[]>;
    get path() {
        return this.pathSignal.value;
    }

    taskIdSignal = computed(() => this.path[this.path.length - 1]);
    get taskId() {
        return this.taskIdSignal.value;
    }

    taskSignal = computed(() => environment.getTask(this.taskId));
    get task() {
        return this.taskSignal.value;
    }

    get depth() {
        return this.pathSignal.value.length;
    }

    push(id: string) {
        this.pathSignal.value = [...this.pathSignal.value, id];
    }

    pop(n: number = 1) {
        this.pathSignal.value = produce(this.pathSignal.value, (draft) => {
            draft.splice(this.depth - n);
        });
    }

    setDepth(depth: number) {
        if (depth >= this.depth) throw Error();

        this.pathSignal.value = this.pathSignal.value.slice(0, depth);
    }

    viewParent(parentId: string) {
        this.pathSignal.value = this.buildPathTo(parentId);
    }

    buildPathTo(id: string) {
        const parents = [id];

        while (true) {
            const pathRoot = environment.getTask(parents[parents.length - 1]);

            if (pathRoot.isRoot) break;

            parents.push(pathRoot.parents[0].id);
        }

        return parents.reverse();
    }
}

export const taskRouter = new TaskRouter();
