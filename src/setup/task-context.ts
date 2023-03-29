import { signal } from '@preact/signals-react';
import { TaskBase } from '../task/entity/base';
import { TaskContext } from '../task/entity/context';

export const taskContext = new TaskContext({
	name: 'All tasks',
	state: signal([]),
});

const taskC = new TaskBase({ textState: signal('C') });
const taskD = new TaskBase({ textState: signal('D') });

taskContext.add(taskC);
taskContext.add(taskD);
taskContext.add(
	new TaskBase({
		textState: signal('A'),
		parentIdsState: signal(new Set([taskC.id])),
	}),
);
taskContext.add(
	new TaskBase({
		textState: signal('B'),
		parentIdsState: signal(new Set([taskC.id, taskD.id])),
	}),
);
taskContext.add(new TaskBase({ textState: signal('E') }));
