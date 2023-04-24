import { AddSubtaskUseCase } from '../add-subtask.feature/add-subtask.use-case';
import { TaskManager } from '../core/task-manager';
import { TaskStatus } from '../core/task-status';

export class CreateSubtaskUseCase {
	constructor(
		private taskManager: TaskManager,
		private addSubtaskUseCase: AddSubtaskUseCase,
	) {}

	run(
		subtaskParams: { text: string; status: TaskStatus },
		parentTaskID: string,
	) {
		const subtask = this.taskManager.createTask(subtaskParams.text);
		subtask.staticStatus = subtaskParams.status;
		this.addSubtaskUseCase.run(subtask.id, parentTaskID);
	}
}
