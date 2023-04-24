import { TaskManager } from 'src/task/core/task-manager';

export class PreferAsMainBoardTaskUseCase {
	constructor(private taskManager: TaskManager) {}

	run = (prefers: boolean, taskID: string) => {
		this.taskManager.getTask(taskID).userPrefersAsMainBoardTask = prefers;
	};
}
