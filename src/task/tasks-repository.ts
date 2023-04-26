import { TasksRepository } from './application/tasks-repository';
import { Task } from './core/task';
import { TaskManager } from './core/task-manager';
import { TaskStatus } from './core/task-status';

const TASKS_LOCAL_STORAGE_KEY = 'tasks';

export class TasksRepositoryImpl implements TasksRepository {
	constructor(private taskManager: TaskManager) {}

	save(): void {
		const taskTemplates = this.taskManager.allTasks.map(taskToTaskTemplate);
		localStorage.setItem(
			TASKS_LOCAL_STORAGE_KEY,
			JSON.stringify(taskTemplates),
		);
	}

	load(): Task[] {
		const serializedTasks = localStorage.getItem(TASKS_LOCAL_STORAGE_KEY);
		if (!serializedTasks) {
			return [];
		}

		const taskTemplates: TaskTemplate[] = JSON.parse(serializedTasks);
		const tasks = taskTemplates.map((template) =>
			taskTemplateToTask(this.taskManager, template),
		);

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
}

export type TaskTemplate = {
	id: string;
	text: string;
	staticStatus: TaskStatus;
	subtaskIDs: string[];
	userPrefersAsMainBoardTask: boolean;
};

function taskToTaskTemplate(task: Task): TaskTemplate {
	return {
		id: task.id,
		text: task.text,
		staticStatus: task.staticStatus,
		subtaskIDs: task.subtasks.map((subtask) => subtask.id),
		userPrefersAsMainBoardTask: task.userPrefersAsMainBoardTask,
	};
}

function taskTemplateToTask(
	taskManager: TaskManager,
	taskTemplate: TaskTemplate,
): Task {
	const task = taskManager.createTask(taskTemplate.text, taskTemplate.id);
	task.staticStatus = taskTemplate.staticStatus;
	task.userPrefersAsMainBoardTask = taskTemplate.userPrefersAsMainBoardTask;
	return task;
}
