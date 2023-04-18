import { Task } from './task';

export class TaskManager {
	allTasks: Task[] = [];

	createTask(text: string) {
		const task: Task = new Task(text, this);
		this.allTasks.push(task);
		return task;
	}
}
