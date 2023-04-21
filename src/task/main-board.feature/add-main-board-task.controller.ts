import {
	AddTaskController,
	AfterAddTaskObserver,
} from '../add-task.feature/add-task.controller';
import { AddTaskUseCase } from '../add-task.feature/add-task.use-case';
import { TaskStatus } from '../core/task-status';
import { ViewMainBoardController } from './view-main-board.controller';

export class AddMainBoardTaskController {
	constructor(
		addTaskUseCase: AddTaskUseCase,
		afterAddMainBoardTaskObserver: AfterAddMainBoardTaskObserver,
	) {
		this.addTaskController = new AddTaskController(
			addTaskUseCase,
			afterAddMainBoardTaskObserver,
		);
	}

	private addTaskController: AddTaskController;

	run = (text: string, options: { status: TaskStatus }) => {
		this.addTaskController.run(text, {
			status: options.status,
			parentTaskIDs: [],
		});
	};
}

export class AfterAddMainBoardTaskObserver implements AfterAddTaskObserver {
	constructor(private viewMainBoardController: ViewMainBoardController) {}

	afterAdd(): void {
		this.viewMainBoardController.run();
	}
}
