import { useState } from 'react';
import { TaskStatus } from '../entity/status';
import { useCurrentTaskController } from './hooks/use-task-controller';

export function TaskForm({ status }: { status: TaskStatus }) {
	const taskController = useCurrentTaskController();
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
				onKeyDown={testSubmitFormTrigger}
				className="h-24 w-full resize-none rounded px-4 py-2"
				autoFocus
			/>
			<button
				onClick={submitForm}
				className="mt-2 rounded bg-blue-600 px-4 py-2 text-white shadow-md hover:bg-blue-700"
			>
				Add task
			</button>
		</div>
	);

	function testSubmitFormTrigger(e: React.KeyboardEvent<HTMLTextAreaElement>) {
		if (e.key === 'Enter') {
			e.preventDefault();
			submitForm();
		}
	}

	function submitForm() {
		taskController.addChildTask({ text, status });
		setText('');
		setShowForm(false);
	}
}
