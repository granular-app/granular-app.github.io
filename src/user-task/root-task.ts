import { computed } from '@preact/signals-react';
import { allTasks } from './all-tasks';
import { ParentUserTask } from './user-task';

export const rootTask: ParentUserTask = new ParentUserTask({
    id: 'root',
    parents: [],
    text: 'All tasks',
    children: computed(() =>
        allTasks.value.filter((task) => task.id !== rootTask.id),
    ),
});
