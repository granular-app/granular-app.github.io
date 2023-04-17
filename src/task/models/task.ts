import { deriveTaskStatus, TaskStatus } from './task-status';

export class Task {
	constructor(public text: string, options?: { status: TaskStatus }) {
		this.staticStatus = options?.status ?? TaskStatus.ToDo;
	}

	subtasks: Task[] = [];
	staticStatus: TaskStatus;
	get status(): TaskStatus {
		if (this.subtasks.length > 0) {
			return this.derivedStatus;
		} else {
			return this.staticStatus;
		}
	}

	get derivedStatus(): TaskStatus {
		return deriveTaskStatus(this.subtasks.map((subtask) => subtask.status));
	}

	createSubtask(text: string, options?: { status: TaskStatus }) {
		const newSubtask = new Task(text, options);
		this.subtasks.push(newSubtask);
		return newSubtask;
	}
}
