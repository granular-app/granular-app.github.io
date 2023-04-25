import { TaskManager } from '../core/task-manager';

export class AttachSubtaskUseCase {
	constructor(private taskManager: TaskManager) {}

	run = (subtaskID: string, parentTaskID: string) => {
		const parentTask = this.taskManager.getTask(parentTaskID);
		const subtask = this.taskManager.getTask(subtaskID);
		parentTask.subtasks.push(subtask);
	};
}
