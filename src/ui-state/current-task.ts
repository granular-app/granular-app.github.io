import { computed, signal } from '@preact/signals-react';
import { environment } from '../task/all-tasks';
import { rootTaskId } from '../task/task';

export const currentTaskId = signal<string>(rootTaskId);
export const currentTask = computed(() =>
    environment.getTask(currentTaskId.value),
);
