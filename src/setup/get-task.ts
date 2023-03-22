import { createGetTask } from '../task/ui-getter/get-task';
import { taskContext } from './task-context';

export const getTask = createGetTask(taskContext);
