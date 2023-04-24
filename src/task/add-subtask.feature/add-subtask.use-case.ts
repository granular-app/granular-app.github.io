import { TaskManager } from '../core/task-manager';
import { TaskStatus } from '../core/task-status';

export class AddSubtaskUseCase {
	constructor(private taskManager: TaskManager) {}

	run(
		subtaskParams: { text: string; status: TaskStatus },
		parentTaskID: string,
	) {
		const parentTask = this.taskManager.getTask(parentTaskID);
		const subtask = this.taskManager.createTask(subtaskParams.text);
		subtask.staticStatus = subtaskParams.status;
		parentTask.subtasks.push(subtask);
	}
}
