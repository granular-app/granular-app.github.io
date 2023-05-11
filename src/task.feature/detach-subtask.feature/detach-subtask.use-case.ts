import { TasksRepository } from '../application/tasks-repository';
import { TaskManager } from '../core/task-manager.entity';

export class DetachSubtaskUseCase {
	constructor(
		private taskManager: TaskManager,
		private tasksRepo: TasksRepository,
	) {}

	run = (subtaskID: string, parentTaskID: string) => {
		const parentTask = this.taskManager.getTask(parentTaskID);
		parentTask.detachSubtask(subtaskID);
		this.tasksRepo.save();
	};
}
