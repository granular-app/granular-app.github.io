import { TasksRepository } from 'src/task.feature/application/tasks-repository';
import { TaskStatus } from 'src/task.feature/core/task-status.entity';
import { MainBoard } from '../main-board.entity';

export class AddMainBoardTaskUseCase {
	constructor(
		private mainBoard: MainBoard,
		private tasksRepo: TasksRepository,
	) {}

	run(params: { text: string; status: TaskStatus }) {
		this.mainBoard.createTask(params);
		this.tasksRepo.save();
	}
}
