import { TaskStatus } from './task.feature/core/task-status.entity';
import { adapters } from './ui/setup/adapters';

export function createExampleTasks() {
	adapters.addMainBoardTaskController.run({
		text: 'Task 1',
		status: TaskStatus.ToDo,
	});
	const task1ID =
		adapters.forceGetMainBoard().tasksByStatus[TaskStatus.ToDo][0].id;
	adapters.viewTaskController.run(task1ID);
	adapters.addViewedTaskSubtaskController.run({
		text: 'Task 1.1',
		status: TaskStatus.ToDo,
	});
	adapters.viewMainBoardController.run();
	adapters.addMainBoardTaskController.run({
		text: 'Task 2',
		status: TaskStatus.InProgress,
	});
	adapters.addMainBoardTaskController.run({
		text: 'Task 3',
		status: TaskStatus.Completed,
	});
}
