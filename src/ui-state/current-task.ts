import { computed, signal } from '@preact/signals-react';
import { allTasks } from '../user-task/all-tasks';
import { rootTask } from '../user-task/root-task';

export const currentTaskId = signal(rootTask.id);
export const currentTask = computed(
    () => allTasks.value.find((t) => t.id === currentTaskId.value)!,
);
export const currentTaskParents = computed(() =>
    allTasks.value.filter((t) => currentTask.value.parents.includes(t.id)),
);
export const currentTaskChildren = computed(() =>
    allTasks.value.filter((t) => t.parents.includes(currentTaskId.value)),
);
