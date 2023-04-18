import { Just, Maybe, Nothing } from 'purify-ts';

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

export function deriveTaskStatus(statuses: TaskStatus[]): Maybe<TaskStatus> {
	if (statuses.length === 0) return Nothing;

	return Just(
		taskStatusDeriviationPriority[
			Math.max(
				...statuses.map((status) =>
					taskStatusDeriviationPriority.indexOf(status),
				),
			)
		],
	);
}
