import { signal } from '@preact/signals-react';
import { TaskEnvironmentWrapper } from './environment';
import { rootTaskId } from './task';

export const environment = new TaskEnvironmentWrapper(signal([]));

environment.addRoot({
    text: 'All tasks',
});

const taskC = environment.addTask({
    parentIds: signal(new Set([rootTaskId])),
    text: 'C',
});

const taskD = environment.addTask({
    parentIds: signal(new Set([rootTaskId])),
    text: 'D',
});

environment.addTask({
    text: 'A',
    parentIds: signal(new Set([taskC.id])),
});

environment.addTask({
    text: 'B',
    parentIds: signal(new Set([taskC.id, taskD.id])),
});
