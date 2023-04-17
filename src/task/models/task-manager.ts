import { Task } from './task';

export class TaskManager {
	tasks: Task[] = [];

	createTask(text: string) {
		const task: Task = new Task(text);
		this.tasks.push(task);
		return task;
	}
}
