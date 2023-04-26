import { Task } from '../core/task';
import { TaskStatus } from '../core/task-status';

export function calculateTaskProgress(task: Task) {
	const allSubtasks = task.listAllSubtasks();
	const allSubtasksCount = allSubtasks.length;
	const allCompletedSubtasksCount = allSubtasks.filter(
		(subtask) => subtask.status === TaskStatus.Completed,
	).length;

	return allCompletedSubtasksCount / allSubtasksCount;
}
