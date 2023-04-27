import { TasksRepository } from './application/tasks-repository';
import { Task } from './core/task';
import { TaskManager } from './core/task-manager';
import {
	serializeTaskTemplates,
	tasksToTaskTemplates,
	TaskTemplate,
	taskTemplatesToTasks,
} from './utils/task-template';

const TASKS_LOCAL_STORAGE_KEY = 'tasks' as const;

export class TasksRepositoryImpl implements TasksRepository {
	constructor(private taskManager: TaskManager) {}

	save(): void {
		const taskTemplates = tasksToTaskTemplates(this.taskManager.allTasks);
		const serializedTasks = serializeTaskTemplates(taskTemplates);

		localStorage.setItem(TASKS_LOCAL_STORAGE_KEY, serializedTasks);
	}

	load(): Task[] {
		const serializedTasks = localStorage.getItem(TASKS_LOCAL_STORAGE_KEY);
		if (!serializedTasks) {
			return [];
		}

		const taskTemplates: TaskTemplate[] = JSON.parse(serializedTasks);
		const tasks = taskTemplatesToTasks(this.taskManager, taskTemplates);

		return tasks;
	}
}
