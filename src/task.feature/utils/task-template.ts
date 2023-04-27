import { Task } from '../core/task';
import { TaskManager } from '../core/task-manager';
import { TaskStatus } from '../core/task-status';

export type TaskTemplate = {
	id: string;
	text: string;
	staticStatus: TaskStatus;
	subtaskIDs: string[];
	userPrefersAsMainBoardTask: boolean;
};

export function tasksToTaskTemplates(tasks: Task[]): TaskTemplate[] {
	return tasks.map(taskToTaskTemplate);
}

export function taskToTaskTemplate(task: Task): TaskTemplate {
	return {
		id: task.id,
		text: task.text,
		staticStatus: task.staticStatus,
		subtaskIDs: task.subtasks.map((subtask) => subtask.id),
		userPrefersAsMainBoardTask: task.userPrefersAsMainBoardTask,
	};
}

export function taskTemplatesToTasks(
	taskManager: TaskManager,
	taskTemplates: TaskTemplate[],
): Task[] {
	const tasks = taskTemplates.map(taskTemplateToTask);

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

	function taskTemplateToTask(taskTemplate: TaskTemplate): Task {
		const task = taskManager.createTask(taskTemplate.text, taskTemplate.id);
		task.staticStatus = taskTemplate.staticStatus;
		task.userPrefersAsMainBoardTask = taskTemplate.userPrefersAsMainBoardTask;
		return task;
	}
}

export function serializeTaskTemplates(taskTemplates: TaskTemplate[]) {
	const indentation = 4;

	return JSON.stringify(taskTemplates, null, indentation);
}
