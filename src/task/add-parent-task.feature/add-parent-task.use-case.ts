import { TaskManager } from '../core/task-manager';

export class AddParentTaskUseCase {
	constructor(private taskManager: TaskManager) {}

	run = (taskID: string, parentTaskID: string) => {
		const task = this.taskManager.getTask(taskID);
		const parentTask = this.taskManager.getTask(parentTaskID);

		parentTask.subtasks.push(task);
	};
}
