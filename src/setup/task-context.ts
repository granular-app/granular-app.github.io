import { signal } from '@preact/signals-react';
import { TaskBase } from '../task/entity/base';
import { TaskContext } from '../task/entity/context';

export const taskContext = new TaskContext({
	name: 'All tasks',
	state: signal([]),
});

const taskC = new TaskBase({ text: 'C' });
const taskD = new TaskBase({ text: 'D' });

taskContext.add(taskC);
taskContext.add(taskD);
taskContext.add(
	new TaskBase({
		text: 'A',
		parentIds: signal(new Set([taskC.id])),
	}),
);
taskContext.add(
	new TaskBase({
		text: 'B',
		parentIds: signal(new Set([taskC.id, taskD.id])),
	}),
);
