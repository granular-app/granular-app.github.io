import { TaskStatus } from '../core/task-status.entity';
import { Task } from '../core/task.entity';

export function calculateTaskProgress(task: Task) {
	const allSubtasks = task.listAllSubtasks();
	const allSubtasksCount = allSubtasks.length;
	const allCompletedSubtasksCount = allSubtasks.filter(
		(subtask) => subtask.status === TaskStatus.Completed,
	).length;

	return allCompletedSubtasksCount / allSubtasksCount;
}
