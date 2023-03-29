import { useSignal } from '@preact/signals-react';
import { TaskStatus } from '../entity/status';
import { useCurrentTaskController } from './hooks/use-task-controller';

export function TaskForm({ status }: { status: TaskStatus }) {
	const taskController = useCurrentTaskController();
	const showForm = useSignal(false);
	const text = useSignal('');

	if (!showForm.value) {
		return (
			<button
				className="flex w-full justify-between rounded py-1 px-4 text-left text-zinc-700 hover:bg-zinc-50"
				onClick={() => (showForm.value = !showForm.value)}
			>
				<span>Add task</span>
				<i className="ri-add-line"></i>
			</button>
		);
	}

	return (
		<div role="form" className="mt-4">
			<textarea
				value={text.value}
				onChange={(e) => (text.value = e.target.value)}
				onKeyDown={testSubmitFormTrigger}
				className="h-max w-full resize-y rounded px-4 py-2"
				autoFocus
			/>
			<div className="mt-2 flex justify-end space-x-2">
				<button
					onClick={closeForm}
					className="rounded px-3 py-1 hover:bg-zinc-200"
				>
					Cancel
				</button>
				<button
					onClick={submitForm}
					className="rounded bg-blue-600 px-3 py-1 text-white shadow-md hover:bg-blue-700"
				>
					Add task
				</button>
			</div>
		</div>
	);

	function testSubmitFormTrigger(e: React.KeyboardEvent<HTMLTextAreaElement>) {
		if (e.key === 'Enter') {
			e.preventDefault();
			submitForm();
		}
	}

	function submitForm() {
		taskController.addChildTask({ text: text.value, status });
		closeForm();
	}

	function closeForm() {
		text.value = '';
		showForm.value = false;
	}
}
