import { ViewMainBoardUseCase } from '../application/view-main-board-use-case';

export class ViewMainBoardController {
	constructor(private viewMainBordUseCase: ViewMainBoardUseCase) {}

	run() {
		return this.viewMainBordUseCase.run();
	}
}
