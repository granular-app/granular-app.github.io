import { signal, Signal } from '@preact/signals-react';
import produce from 'immer';
import { nanoid } from 'nanoid';
import { TaskStatus } from './status';

export type TaskBaseTemplate = {
	id?: string;
	textState: Signal<string>;
	parentIdsState?: Signal<Set<string>>;
	staticStatusState?: Signal<TaskStatus>;
	prefersStaticStatusState?: Signal<boolean>;
};

export class TaskBase {
	constructor({
		id,
		textState: text,
		parentIdsState: parentIds,
		staticStatusState: staticStatus,
		prefersStaticStatusState: prefersStaticStatus,
	}: TaskBaseTemplate) {
		this.id = id ?? TaskBase.generateId();
		this.textState = text;
		this.parentIdsState = parentIds ?? signal(new Set());
		this.staticStatusState = staticStatus ?? signal(TaskStatus.ToDo);
		this.prefersStaticStatusState = prefersStaticStatus ?? signal(false);
	}

	private static generateId = nanoid;

	id: string;

	private textState: Signal<string>;
	get text() {
		return this.textState.value;
	}
	set text(value: string) {
		this.textState.value = value;
	}

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
	togglePrefersStaticStatus() {
		this.prefersStaticStatus = !this.prefersStaticStatus;
	}
}
