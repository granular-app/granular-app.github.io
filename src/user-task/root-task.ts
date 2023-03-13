import { allTasks } from './all-tasks';
import { ParentUserTask } from './user-task';

export const rootTask: ParentUserTask = ParentUserTask.fromContext({
    id: 'root',
    parents: [],
    text: 'All tasks',
    getContext: () => allTasks.value,
});
