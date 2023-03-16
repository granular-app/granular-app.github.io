import { signal } from '@preact/signals-react';
import { TaskEnvironmentWrapper } from './environment';

export const environment = new TaskEnvironmentWrapper(signal([]));

const rootTask = environment.addRoot({
    text: 'All tasks',
});

const taskC = environment.addTask({
    parentIds: signal(new Set([rootTask.id])),
    text: 'C',
});

const taskD = environment.addTask({
    parentIds: signal(new Set([rootTask.id])),
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
