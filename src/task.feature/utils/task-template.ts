import { TaskStatus } from '../core/task-status.entity';
import { Task } from '../core/task.entity';

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
		subtaskIDs: task.subtasks.get().map((subtask) => subtask.id),
		userPrefersAsMainBoardTask: task.userPrefersAsMainBoardTask,
	};
}

export function serializeTaskTemplates(taskTemplates: TaskTemplate[]) {
	const indentation = 4;

	return JSON.stringify(taskTemplates, null, indentation);
}
