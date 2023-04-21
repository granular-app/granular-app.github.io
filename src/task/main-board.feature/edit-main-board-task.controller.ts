import { AfterEditTaskObserver } from '../edit-task.feature/edit-task.controller';
import { ViewMainBoardController } from './view-main-board.controller';

export class AfterEditMainBoardTaskObserver implements AfterEditTaskObserver {
	constructor(private viewMainBoardController: ViewMainBoardController) {}

	afterEdit() {
		this.viewMainBoardController.run();
	}
}
