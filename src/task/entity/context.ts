import { computed, ReadonlySignal, Signal } from '@preact/signals-react';
import { TaskBase } from './base';
import { rootTaskId, Task, TaskArray } from './task';

export class TaskContext {
	constructor({ name, state }: { name: string; state: Signal<TaskBase[]> }) {
		this.name = name;
		this.state = state;
	}

	name: string;

	private rootTaskState = computed(
		() =>
			new Task({
				base: TaskBase.fromStatelessTemplate({
					id: rootTaskId,
					text: this.name,
				}),
				context: this,
			}),
	);
	get rootTask() {
		return this.rootTaskState.value;
	}

	private state: Signal<TaskBase[]>;
	updateState(value: TaskBase[]) {
		this.state.value = value;
	}

	private tasksState: ReadonlySignal<Task[]> = computed(() =>
		this.state.value.map(
			(base) =>
				new Task({
					base,
					context: this,
				}),
		),
	);
	get tasks() {
		return this.tasksState.value;
	}

	get(id: string) {
		return id === rootTaskId
			? this.rootTask
			: new TaskArray(this.tasks).get(id);
	}

	add(base: TaskBase) {
		if (this.tasks.map((task) => task.base.id).includes(base.id)) {
			throw Error('Tasks with duplicate IDs are not allowed');
		}

		this.updateState([...this.state.value, base]);
	}

	delete(id: string) {
		const { children } = this.get(id);

		children.forEach((child) => {
			if (child.base.parentIds.size > 1) {
				child.base.removeParent(id);
			} else {
				this.delete(child.base.id);
			}
		});

		this.updateState(this.state.value.filter((task) => task.id !== id));
	}

	clear() {
		this.updateState([]);
	}
}
