import { useSignal } from '@preact/signals-react';
import { TaskUIModel } from '../ui-model/task';
import { useTaskController } from './hooks/use-task-controller';

export function TaskForm({
	initialText = '',
	submitLabel,
	onSubmit,
	onClose,
}: {
	initialText?: string;
	submitLabel: string;
	onSubmit: (text: string) => void;
	onClose: () => void;
}) {
	const text = useSignal(initialText);

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
					{submitLabel}
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
		onSubmit(text.value);
		closeForm();
	}

	function closeForm() {
		text.value = '';
		onClose();
	}
}

export function EditTaskForm({
	task,
	onCloseForm,
}: {
	task: TaskUIModel;
	onCloseForm: () => void;
}) {
	const taskController = useTaskController(task.id);

	return (
		<TaskForm
			initialText={task.text}
			submitLabel="Save"
			onSubmit={setText}
			onClose={onCloseForm}
		/>
	);

	function setText(text: string) {
		taskController.setText(text);
	}
}
