import { batch, signal } from '@preact/signals-react';
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
    ParentUserTask.fromContext({
        getContext: () => allTasks.value,
        id: taskCId,
        parents: [rootTask.id],
        text: 'C',
    }),
    ParentUserTask.fromContext({
        getContext: () => allTasks.value,
        id: taskDId,
        parents: [rootTask.id],
        text: 'D',
    }),
];

export const allTasks = signal<UserTask[]>(initialTasks);

export const AllTasks = {
    updateTaskStatus(id: string, status: TaskStatus): void {
        allTasks.value = produce([...allTasks.value], (draft) => {
            draft.find((t) => t.id === id)!.status.value = status;
        });
    },
    addSubtask(parentId: string, subtask: { text: string; status: TaskStatus }) {
        batch(() => {
            AllTasks.turnIntoParent(parentId);
            allTasks.value = [
                ...allTasks.value,
                {
                    id: nanoid(),
                    parents: [parentId],
                    text: subtask.text,
                    status: signal(subtask.status),
                },
            ];
        });
    },
    getSubtasks(id: string): UserTask[] {
        return allTasks.value.filter((t) => t.parents.includes(id));
    },
    getSubtree(id: string): Set<UserTask> {
        return new Set([
            allTasks.value.find((t) => t.id === id)!,
            ...AllTasks.getSubtasks(id).flatMap((t) => [
                t,
                ...AllTasks.getSubtree(t.id),
            ]),
        ]);
    },
    addParent(id: string, parentId: string) {
        batch(() => {
            AllTasks.turnIntoParent(parentId);
            allTasks.value = produce([...allTasks.value], (draft) => {
                draft.find((t) => t.id === id)!.parents.push(parentId);
            });
        });
    },
    turnIntoParent(id: string): void {
        const index = allTasks.value.findIndex((task) => task.id === id)!;

        if (allTasks.value[index] instanceof ParentUserTask) return;

        allTasks.value = produce([...allTasks.value], (draft) => {
            draft.splice(
                index,
                1,
                ParentUserTask.fromContext({
                    ...allTasks.value[index],
                    getContext: () => allTasks.value,
                }),
            );
        });
    },
    getPotentialParents(id: string): Set<UserTask> {
        const task = allTasks.value.find((t) => t.id === id)!;
        const subtree = new Set([...AllTasks.getSubtree(id)].map((t) => t.id));

        return new Set(
            allTasks.value.filter(
                (t) => !(subtree.has(t.id) || task.parents.includes(t.id)),
            ),
        );
    },
};
