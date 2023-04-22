import { DeleteTaskUseCase } from './delete-task.use-case';

export class DeleteTaskController {
	constructor(
		private deleteTaskUseCase: DeleteTaskUseCase,
		private afterDeleteObserver: AfterDeleteTaskObserver,
	) {}

	run = (taskID: string) => {
		this.deleteTaskUseCase.run(taskID);
		this.afterDeleteObserver.afterDelete();
	};
}

export interface AfterDeleteTaskObserver {
	afterDelete(): void;
}
