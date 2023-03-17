import { signal, Signal } from '@preact/signals-react';
import produce from 'immer';
import { nanoid } from 'nanoid';
import { TaskStatus } from './status';

export type TaskBaseTemplate = {
    id?: string;
    text: string;
    parentIds?: Signal<Set<string>>;
    staticStatus?: Signal<TaskStatus>;
    prefersStaticStatus?: Signal<boolean>;
};

export class TaskBase {
    constructor({
        id,
        text,
        parentIds,
        staticStatus,
        prefersStaticStatus,
    }: TaskBaseTemplate) {
        this.id = id ?? TaskBase.generateId();
        this.text = text;
        this.parentIdsState = parentIds ?? signal(new Set());
        this.staticStatusState = staticStatus ?? signal(TaskStatus.ToDo);
        this.prefersStaticStatusState = prefersStaticStatus ?? signal(false);
    }

    private static generateId = nanoid;

    id: string;
    text: string;

    /* Parents */

    private parentIdsState: Signal<Set<string>>;
    get parentIds() {
        return this.parentIdsState.value;
    }
    private updateParentIds(update: (draft: Set<string>) => Set<string> | void) {
        this.parentIdsState.value = produce(this.parentIds, update);
    }

    addParent(parentId: string) {
        if (parentId === this.id) throw Error();

        this.updateParentIds((draft) => {
            draft.add(parentId);
        });
    }

    removeParent(parentId: string) {
        this.updateParentIds((draft) => {
            draft.delete(parentId);
        });
    }

    /* Status */

    staticStatusState: Signal<TaskStatus>;
    get staticStatus() {
        return this.staticStatusState.value;
    }
    set staticStatus(newValue: TaskStatus) {
        this.staticStatusState.value = newValue;
    }

    prefersStaticStatusState: Signal<boolean>;
    get prefersStaticStatus() {
        return this.prefersStaticStatusState.value;
    }
    set prefersStaticStatus(newValue: boolean) {
        this.prefersStaticStatusState.value = newValue;
    }
    togglePrefersStatisStatus() {
        this.prefersStaticStatus = !this.prefersStaticStatus;
    }
}
