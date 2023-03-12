import { signal } from '@preact/signals-react';
import produce from 'immer';
import { nanoid } from 'nanoid';
import { rootTask } from './root-task';
import { TaskStatus } from './task-status';
import { ParentUserTask, UserTask } from './user-task';

const taskCId = nanoid();
const taskDId = nanoid();
const initialTasks: UserTask[] = [
    rootTask,
    {
        id: nanoid(),
        parents: [taskCId],
        text: 'A',
        status: signal('To Do'),
    },
    {
        id: nanoid(),
        parents: [taskCId, taskDId],
        text: 'B',
        status: signal('To Do'),
    },
    ParentUserTask.fromTasks({
        getTasks: () => allTasks.value,
        id: taskCId,
        parents: [rootTask.id],
        text: 'C',
    }),
    ParentUserTask.fromTasks({
        getTasks: () => allTasks.value,
        id: taskDId,
        parents: [rootTask.id],
        text: 'D',
    }),
];

export const allTasks = signal<UserTask[]>(initialTasks);

type UpdateTaskStatus = (id: string, status: TaskStatus) => void;
export const updateTaskStatus: UpdateTaskStatus = (id, status) => {
    allTasks.value = produce([...allTasks.value], (draft) => {
        draft.find((t) => t.id === id)!.status.value = status;
    });
};
