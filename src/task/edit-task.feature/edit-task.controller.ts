import { EditTaskUseCase } from './edit-task.use-case';

export class EditTaskController {
	constructor(
		private editTaskUseCase: EditTaskUseCase,
		private afterEditTaskObserver: AfterEditTaskObserver,
	) {}

	run = (id: string, newText: string) => {
		this.editTaskUseCase.run(id, newText);
		this.afterEditTaskObserver.afterEdit();
	};
}

export interface AfterEditTaskObserver {
	afterEdit(): void;
}
