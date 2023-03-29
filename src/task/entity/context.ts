import {
	computed,
	ReadonlySignal,
	signal,
	Signal,
} from '@preact/signals-react';
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
				base: new TaskBase({
					id: rootTaskId,
					textState: signal(this.name),
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
}
