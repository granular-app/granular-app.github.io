import { TaskStatus } from '../entity/status';
import { Task } from '../entity/task';

export class TaskUseCases {
	constructor({ task }: { task: Task }) {
		this.task = task;
	}

	private task: Task;

	setText(text: string) {
		this.task.base.text = text;
	}

	addParent(id: string) {
		this.task.base.addParent(id);
	}

	removeParent(id: string) {
		this.task.base.removeParent(id);
	}

	addChildTask(params: { text: string; staticStatus: TaskStatus }) {
		this.task.addChildTask(params);
	}

	deleteTask() {
		this.task.delete();
	}

	setStaticStatus(newStatus: TaskStatus) {
		this.task.base.staticStatus = newStatus;
	}

	togglePrefersStaticStatus() {
		this.task.base.togglePrefersStaticStatus();
	}

	setPrefersStaticStatus() {
		this.task.base.prefersStaticStatus = true;
	}

	setPrefersDynamicStatus() {
		this.task.base.prefersStaticStatus = false;
	}
}
