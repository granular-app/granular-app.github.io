import { computed, effect, signal, Signal } from '@preact/signals-react';
import { TaskContext } from '../entity/context';
import { rootTaskId } from '../entity/task';

export class TaskRouter {
	constructor({ taskContext }: { taskContext: TaskContext }) {
		this.taskContext = taskContext;
		effect(() => this.ensureConsistency()); // TODO: unsubscribe
	}

	private taskContext: TaskContext;
	private internalPathState: Signal<string[]> = signal([]);
	private pathState = computed(() => [rootTaskId, ...this.internalPath]);
	private taskIdState = computed(() => {
		return this.path[this.path.length - 1];
	});
	currentTaskState = computed(() => {
		return this.taskContext.get(this.taskId);
	});

	private get internalPath() {
		return this.internalPathState.value;
	}
	get path() {
		return this.pathState.value;
	}
	get taskId() {
		return this.taskIdState.value;
	}
	get currentTask() {
		return this.currentTaskState.value;
	}
	get depth() {
		return this.internalPath.length;
	}

	push(id: string) {
		this.internalPathState.value = [...this.internalPath, id];
	}

	pop(n: number = 1) {
		this.setDepth(-n);
	}

	setDepth(depth: number) {
		if (depth >= this.depth) throw Error();

		this.internalPathState.value = this.internalPath.slice(0, depth);
	}

	viewTask(id: string) {
		this.internalPathState.value = this.buildInternalPathTo(id);
	}

	buildInternalPathTo(id: string) {
		if (id === rootTaskId) return [];

		const reversePath = [id];

		while (true) {
			const taskId = reversePath[reversePath.length - 1];
			const task = this.taskContext.get(taskId);
			if (task.isChildOfRoot) {
				break;
			} else {
				reversePath.push(task.parents[0].base.id);
			}
		}

		return reversePath.reverse();
	}

	get isConsistent() {
		if (this.currentTask.isRoot) return this.internalPath.length === 0;
		if (this.currentTask.isChildOfRoot) return this.internalPath.length === 1;

		return this.internalPath.length > 1;
	}

	ensureConsistency() {
		if (!this.isConsistent) {
			this.viewTask(this.currentTask.base.id);
		}
	}
}
