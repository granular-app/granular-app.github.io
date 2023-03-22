import { TaskControllerFactory } from '../task/ui-controller/task-controller';
import { taskContext } from './task-context';
import { taskRouter } from './task-router';

export const taskControllerFactory = new TaskControllerFactory({
	taskContext,
	taskRouter,
});
