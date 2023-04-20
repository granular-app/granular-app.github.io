import { TaskManager } from '../core/task-manager';
import { TaskStatus } from '../core/task-status';

export class AddTaskUseCase {
	constructor(private taskManager: TaskManager) {}

	run(text: string, options: { status: TaskStatus; parentTaskIDs: string[] }) {
		const newTask = this.taskManager.createTask(text);
		newTask.staticStatus = options.status;
		options.parentTaskIDs.forEach((parentTaskID) => {
			const parentTask = this.taskManager.getTask(parentTaskID);
			parentTask.subtasks.push(newTask);
		});
	}
}
