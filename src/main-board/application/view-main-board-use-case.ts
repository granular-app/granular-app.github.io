import { MainBoard } from '../core/main-board';

export class ViewMainBoardUseCase {
	constructor(
		private mainBoard: MainBoard,
		private output: ViewMainBoardUseCaseOutputPort,
	) {}

	run() {
		this.output(this.mainBoard);
	}
}

export type ViewMainBoardUseCaseOutputPort = (mainBoard: MainBoard) => void;
