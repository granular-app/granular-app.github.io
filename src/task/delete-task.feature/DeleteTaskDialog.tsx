import { Dialog } from '@headlessui/react';
import { Signal } from '@preact/signals-react';

export function DeleteTaskDialog(props: {
	isOpen: Signal<boolean>;
	delete: () => void;
}) {
	return (
		<Dialog
			className="relative z-50"
			open={props.isOpen.value}
			onClose={() => (props.isOpen.value = false)}
		>
			<div className="fixed inset-0 bg-black/30" aria-hidden="true" />
			<div className="fixed inset-0 flex items-center justify-center p-4">
				<Dialog.Panel className="mx-auto max-w-sm rounded bg-white p-4">
					<Dialog.Title className="text-lg font-bold text-gray-700">
						Delete task?
					</Dialog.Title>
					<Dialog.Description className="my-2 text-gray-800">
						This will delete the task and all of its orphan subtasks. This
						action cannot be undone.
					</Dialog.Description>

					<div className="flex justify-end">
						<button
							className="button shadow-none ring-0"
							onClick={() => (props.isOpen.value = false)}
						>
							Cancel
						</button>
						<button
							className="button ml-2 text-red-700 ring-red-300 hover:bg-red-50"
							onClick={() => {
								props.delete();
								props.isOpen.value = false;
							}}
						>
							Delete
						</button>
					</div>
				</Dialog.Panel>
			</div>
		</Dialog>
	);
}
