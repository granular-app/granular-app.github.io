export const TaskStatus = {
	ToDo: 'to-do',
	InProgress: 'in-progress',
	Completed: 'completed',
} as const;
export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];

const taskStatusDeriviationPriority = [
	// To smallest priority
	TaskStatus.Completed,
	TaskStatus.ToDo,
	TaskStatus.InProgress,
	// From biggest priority
] as const;

export function deriveTaskStatus(statuses: TaskStatus[]): TaskStatus {
	return taskStatusDeriviationPriority[
		Math.max(
			...statuses.map((status) =>
				taskStatusDeriviationPriority.indexOf(status),
			),
		)
	];
}
