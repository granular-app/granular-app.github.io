import { TaskManager } from '../core/task-manager';

export class DetachSubtaskUseCase {
	constructor(private taskManager: TaskManager) {}

	run = (subtaskID: string, parentTaskID: string) => {
		const parentTask = this.taskManager.getTask(parentTaskID);
		parentTask.detachSubtask(subtaskID);
	};
}
