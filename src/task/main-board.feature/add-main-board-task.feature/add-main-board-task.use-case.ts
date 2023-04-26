import { TasksRepository } from 'src/task/application/tasks-repository';
import { TaskStatus } from 'src/task/core/task-status';
import { MainBoard } from '../main-board.entity';

export class AddMainBoardTaskUseCase {
	constructor(
		private mainBoard: MainBoard,
		private tasksRepo: TasksRepository,
	) {}

	run(params: { text: string; status: TaskStatus }) {
		this.mainBoard.createTask(params);
		this.tasksRepo.save(this.mainBoard.listAllSubtasks());
	}
}
