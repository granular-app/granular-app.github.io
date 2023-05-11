import { TasksRepository } from '../application/tasks-repository';
import { TaskManager } from '../core/task-manager.entity';

export class AttachSubtaskUseCase {
	constructor(
		private taskManager: TaskManager,
		private tasksRepo: TasksRepository,
	) {}

	run = (subtaskID: string, parentTaskID: string) => {
		const parentTask = this.taskManager.getTask(parentTaskID);
		const subtask = this.taskManager.getTask(subtaskID);
		parentTask.subtasks.addSubtask(subtask);
		this.tasksRepo.save();
	};
}
