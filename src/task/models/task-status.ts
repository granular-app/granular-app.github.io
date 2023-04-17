export const TaskStatus = {
	ToDo: 'to-do',
	InProgress: 'in-progress',
	Completed: 'completed',
} as const;
export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];
