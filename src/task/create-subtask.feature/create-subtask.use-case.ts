import { TasksRepository } from '../application/tasks-repository';
import { AttachSubtaskUseCase } from '../attach-subtask.feature/attach-subtask.use-case';
import { TaskManager } from '../core/task-manager';
import { TaskStatus } from '../core/task-status';

export class CreateSubtaskUseCase {
	constructor(
		private taskManager: TaskManager,
		private attachSubtaskUseCase: AttachSubtaskUseCase,
		private tasksRepo: TasksRepository,
	) {}

	run(
		subtaskParams: { text: string; status: TaskStatus },
		parentTaskID: string,
	) {
		const subtask = this.taskManager.createTask(subtaskParams.text);
		subtask.staticStatus = subtaskParams.status;
		this.attachSubtaskUseCase.run(subtask.id, parentTaskID);
		this.tasksRepo.save(this.taskManager.allTasks);
	}
}
