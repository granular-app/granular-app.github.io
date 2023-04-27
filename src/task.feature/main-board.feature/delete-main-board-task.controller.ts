import {
	AfterDeleteTaskObserver,
	DeleteTaskController,
} from '../delete-task.feature/delete-task.controller';
import { DeleteTaskUseCase } from '../delete-task.feature/delete-task.use-case';
import { ViewMainBoardController } from './view-main-board.controller';

export class DeleteMainBoardTaskController {
	constructor(
		deleteTaskUseCase: DeleteTaskUseCase,
		viewMainBoardController: ViewMainBoardController,
	) {
		this.deleteTaskController = new DeleteTaskController(
			deleteTaskUseCase,
			new AfterDeleteMainBoardTaskObserver(viewMainBoardController),
		);
	}

	private deleteTaskController: DeleteTaskController;

	run = (taskID: string) => {
		this.deleteTaskController.run(taskID);
	};
}

export class AfterDeleteMainBoardTaskObserver
	implements AfterDeleteTaskObserver
{
	constructor(private viewMainBoardController: ViewMainBoardController) {}

	afterDelete(): void {
		this.viewMainBoardController.run();
	}
}
