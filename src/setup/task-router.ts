import { TaskRouter } from '../task/ui-state/task-router';
import { taskContext } from './task-context';

export const taskRouter = new TaskRouter({
	taskContext: taskContext,
});
