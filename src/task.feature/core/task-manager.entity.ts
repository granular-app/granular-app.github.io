import { Maybe } from 'purify-ts';
import { TaskTemplate } from '../utils/task-template';
import { Task } from './task.entity';

export class TaskManager {
	allTasks: Task[] = [];

	createTask(text: string, id?: string) {
		const taskID = id ?? Task.generateID();
		if (this.allTasks.map((task) => task.id).includes(taskID)) {
			throw new Error('Duplicate ID.');
		}

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

	removeAllTasks() {
		this.allTasks = [];
	}

	importTasks(taskTemplates: TaskTemplate[]) {
		const tasks = taskTemplates.map(this.importTask);

		// Reconstruct the subtask relationships based on subtaskIDs
		taskTemplates.forEach((template, index) => {
			template.subtaskIDs.forEach((subtaskID) => {
				const subtask = tasks.find((task) => task.id === subtaskID);
				if (subtask) {
					tasks[index].subtasks.push(subtask);
				}
			});
		});

		return tasks;
	}

	importTask = (taskTemplate: TaskTemplate): Task => {
		const task = this.createTask(taskTemplate.text, taskTemplate.id);
		task.staticStatus = taskTemplate.staticStatus;
		task.userPrefersAsMainBoardTask = taskTemplate.userPrefersAsMainBoardTask;
		return task;
	};
}
