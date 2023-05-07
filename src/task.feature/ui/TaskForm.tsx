import { useSignal } from '@preact/signals-react';
import classNames from 'classnames';
import { putCaretAtTheEnd } from 'src/utils/ui/put-caret-at-the-end';

export function TaskForm({
	initialText = '',
	submitLabel,
	onSubmit,
	onClose,
	extraClassName,
	onEmptyFormBlur,
}: {
	initialText?: string;
	submitLabel: string;
	onSubmit: (text: string) => void;
	onClose: () => void;
	extraClassName?: string;
	onEmptyFormBlur?: () => void;
}) {
	const text = useSignal(initialText);

	return (
		<div role="form" className={classNames('mt-4', extraClassName)}>
			<textarea
				value={text.value}
				onFocus={(evt) => putCaretAtTheEnd(evt.currentTarget)}
				onChange={(evt) => (text.value = evt.target.value)}
				onBlur={() => {
					if (text.value.trim() === '') {
						onEmptyFormBlur?.();
					}
				}}
				onKeyDown={testSubmitFormTrigger}
				className="h-max w-full resize-y rounded border px-4 py-2"
				autoFocus
			/>
			<div className="mt-2 flex justify-end space-x-2">
				<button onClick={closeForm} className="button shadow-none ring-0">
					Cancel
				</button>
				<button
					onClick={submitForm}
					className="button bg-gray-600 text-white shadow ring-gray-800 hover:bg-gray-700"
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
		text.value = '';
	}

	function closeForm() {
		onClose();
	}
}
