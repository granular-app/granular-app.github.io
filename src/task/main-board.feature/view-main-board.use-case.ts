import { MainBoard } from './main-board.entity';

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
