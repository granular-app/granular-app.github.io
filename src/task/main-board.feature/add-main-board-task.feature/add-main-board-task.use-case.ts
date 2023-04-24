import { TaskStatus } from 'src/task/core/task-status';
import { MainBoard } from '../main-board.entity';

export class AddMainBoardTaskUseCase {
	constructor(private mainBoard: MainBoard) {}

	run(params: { text: string; status: TaskStatus }) {
		this.mainBoard.createTask(params);
	}
}
