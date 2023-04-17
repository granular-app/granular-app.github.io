import { Task } from './task';
import { TaskStatus } from './task-status';

export class TaskManager {
	tasks: Task[] = [];

	createTask(text: string, options?: { status: TaskStatus }) {
		const task: Task = new Task(text, options);
		this.tasks.push(task);
		return task;
	}
}
