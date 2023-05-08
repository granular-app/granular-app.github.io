import { TaskStatus, taskStatuses } from '../core/task-status';

export type TaskStatusUIModel = (typeof taskStatusesUIModel)[number];

export const taskStatusesUIModel = taskStatuses.map((status) => {
	return {
		label: presentTaskStatus(status),
		value: status,
	};
});

export function presentTaskStatus(status: TaskStatus) {
	return {
		[TaskStatus.ToDo]: 'To do',
		[TaskStatus.InProgress]: 'In progress',
		[TaskStatus.Completed]: 'Completed',
	}[status];
}
