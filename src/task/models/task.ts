import { deriveTaskStatus, TaskStatus } from './task-status';

export class Task {
	constructor(public text: string) {}

	subtasks: Task[] = [];
	staticStatus: TaskStatus = TaskStatus.ToDo;
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

	createSubtask(text: string) {
		const newSubtask = new Task(text);
		this.subtasks.push(newSubtask);
		return newSubtask;
	}
}
