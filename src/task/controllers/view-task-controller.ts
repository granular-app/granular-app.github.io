import { ViewTaskUseCase } from '../application/view-task-use-case';

export class ViewTaskController {
	constructor(private viewTaskUseCase: ViewTaskUseCase) {}

	run(taskID: string) {
		this.viewTaskUseCase.run(taskID);
	}
}
