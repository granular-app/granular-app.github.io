import { nanoid } from 'nanoid';
import { Maybe } from 'purify-ts';
import { TaskManager } from './task-manager';
import { deriveTaskStatus, TaskStatus } from './task-status';

export class Task {
	constructor(
		public readonly id: string,
		public text: string,
		public taskManager: TaskManager,
	) {}

	static generateID = nanoid;

	subtasks: Task[] = [];
	staticStatus: TaskStatus = TaskStatus.ToDo;
	get status(): TaskStatus {
		return this.derivedStatus.orDefault(this.staticStatus);
	}

	get derivedStatus(): Maybe<TaskStatus> {
		return deriveTaskStatus(this.subtasks.map((subtask) => subtask.status));
	}

	get parentTasks(): Task[] {
		return this.taskManager.allTasks.filter((task) =>
			task.subtasks.includes(this),
		);
	}

	get hasSubtasks() {
		return this.subtasks.length > 0;
	}

	get hasParentTasks() {
		return this.parentTasks.length > 0;
	}

	createSubtask(text: string) {
		const newSubtask = this.taskManager.createTask(text);
		this.subtasks.push(newSubtask);
		return newSubtask;
	}

	private listAllSubtasksSet(): Set<Task> {
		return new Set(
			this.subtasks.flatMap((subtask) => {
				return [subtask, ...subtask.listAllSubtasksSet()];
			}),
		);
	}

	listAllSubtasks() {
		return [...this.listAllSubtasksSet()];
	}
}
