import { Subtasks } from '../core/subtasks.entity';
import { TaskStatus } from '../core/task-status.entity';

export function presentDeepSubtasks(subtasks: Subtasks): DeepSubtasksUIModel {
	const deepSubtasks = subtasks.deepList();
	const count = deepSubtasks.length;
	const completedCount = deepSubtasks.filter(
		(subtask) => subtask.status === TaskStatus.Completed,
	).length;
	const progress = completedCount / count;

	return {
		count,
		completedCount,
		progress,
	};
}

export type DeepSubtasksUIModel = {
	count: number;
	completedCount: number;
	progress: number;
};
