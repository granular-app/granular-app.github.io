import { Maybe } from 'purify-ts';
import { Task } from './task';

export class TaskManager {
	allTasks: Task[] = [];

	createTask(text: string, id?: string) {
		const taskID = id ?? Task.generateID();
		const task: Task = new Task(taskID, text, this);
		this.allTasks.push(task);
		return task;
	}

	/**
	 * When you know a task with a given ID exists.
	 */
	getTask(taskID: string): Task {
		return this.findTask(taskID).extract()!;
	}

	findTask(taskID: string): Maybe<Task> {
		return Maybe.fromNullable(this.allTasks.find((task) => task.id === taskID));
	}

	indexOf(taskID: string) {
		return this.allTasks.findIndex((task) => task.id === taskID);
	}
}
