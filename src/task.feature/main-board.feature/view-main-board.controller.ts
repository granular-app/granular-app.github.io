import { ViewMainBoardUseCase } from './view-main-board.use-case';

export class ViewMainBoardController {
	constructor(private viewMainBoardUseCase: ViewMainBoardUseCase) {}

	run = () => {
		return this.viewMainBoardUseCase.run();
	};
}
