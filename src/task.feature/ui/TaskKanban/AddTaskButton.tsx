import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { useSignal } from '@preact/signals-react';
import { useCallback, useRef } from 'react';
import { runOnNextFrame } from 'src/utils/ui/run-on-next-frame';
import { TaskForm } from '../TaskForm';

export function AddTaskButton(props: { onSubmit: (text: string) => void }) {
	const formVisisble = useSignal(false);
	const openForm = () => (formVisisble.value = true);
	const closeForm = useCallback(() => (formVisisble.value = false), []);
	const buttonRef = useRef<HTMLButtonElement>(null);

	if (formVisisble.value) {
		return (
			<TaskForm
				initialText=""
				onClose={closeForm}
				onSubmit={props.onSubmit}
				submitLabel="Add task"
				onEmptyFormBlur={() => {
					closeForm();
					runOnNextFrame(() => buttonRef.current?.focus());
				}}
			/>
		);
	}

	return (
		<button
			ref={buttonRef}
			className="mt-4 flex w-full items-center rounded-md py-1 font-bold text-gray-700 hover:bg-gray-100"
			onClick={openForm}
		>
			<div className="mr-2 flex h-6 w-6">
				<PlusCircleIcon className="icon m-auto" />
			</div>
			Add task
		</button>
	);
}
