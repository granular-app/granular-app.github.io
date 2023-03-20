import { signal } from '@preact/signals-react';
import { useState } from 'react';
import { TaskBase } from '../entity/base';
import { taskContext } from '../entity/context';
import { TaskStatus } from '../entity/status';
import { taskRouter } from '../ui-state/task-router';

export function TaskForm({ status }: { status: TaskStatus }) {
	const [showForm, setShowForm] = useState(false);
	const [text, setText] = useState('');

	if (!showForm) {
		return (
			<button
				className="w-full rounded py-1 px-4 text-left text-zinc-700 hover:bg-zinc-50"
				onClick={() => setShowForm((value) => !value)}
			>
				Add task
			</button>
		);
	}

	return (
		<div role="form" className="mt-4">
			<textarea
				value={text}
				onInput={(e) => setText(e.currentTarget.value)}
				onKeyDown={triggerTextInputKeybindings}
				className="h-24 w-full resize-none rounded px-4 py-2"
			/>
			<button
				onClick={addTask}
				className="mt-2 rounded bg-blue-600 px-4 py-2 text-white shadow-md hover:bg-blue-700"
			>
				Add task
			</button>
		</div>
	);

	function triggerTextInputKeybindings(
		e: React.KeyboardEvent<HTMLTextAreaElement>,
	) {
		if (e.key === 'Enter') {
			e.preventDefault();
			addTask();
		}
	}

	function addTask() {
		const parent = taskRouter.task;
		const childTaskBase = new TaskBase({
			text,
			parentIds: signal(new Set(parent.isRoot ? [] : [parent.base.id])),
			staticStatus: signal(status),
		});

		taskContext.add(childTaskBase);
		setText('');
		setShowForm(false);
	}
}
