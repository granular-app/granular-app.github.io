import { TaskStatus } from '../core/task-status';

export function presentTaskStatus(status: TaskStatus) {
	return {
		[TaskStatus.ToDo]: 'To do',
		[TaskStatus.InProgress]: 'In progress',
		[TaskStatus.Completed]: 'Completed',
	}[status];
}
