import { Popover } from '@headlessui/react';
import {
	EllipsisVerticalIcon,
	PencilIcon,
	TrashIcon,
} from '@heroicons/react/24/outline';
import { useSignal } from '@preact/signals-react';
import { useCallback } from 'react';
import { usePopper } from 'react-popper';
import { DeleteTaskDialog } from 'src/task.feature/delete-task.feature/DeleteTaskDialog';
import { TaskForm } from 'src/task.feature/ui/TaskForm';
import { useAdapters } from 'src/ui/adapaters';
import { useViewedTask } from './use-viewed-task';

export function TaskTextView() {
	const { text } = useViewedTask();
	const editModeEnabled = useSignal(false);
	const enableEditMode = useCallback(() => {
		editModeEnabled.value = true;
	}, []);
	const disableEditMode = useCallback(() => {
		editModeEnabled.value = false;
	}, []);
	const { editViewedTaskController } = useAdapters();

	if (editModeEnabled.value) {
		return (
			<TaskForm
				initialText={text}
				onClose={disableEditMode}
				onSubmit={editViewedTaskController.run}
				submitLabel="Save"
				extraClassName="mt-2 mb-4"
			/>
		);
	}

	return (
		<h1 className="text-lg">
			<ViewedTaskActionsButton enableEditMode={enableEditMode} />
			{text}
		</h1>
	);
}

export function ViewedTaskActionsButton(props: { enableEditMode: () => void }) {
	const referenceElement = useSignal<HTMLElement | null>(null);
	const popperElement = useSignal<HTMLElement | null>(null);
	const { styles, attributes } = usePopper(
		referenceElement.value,
		popperElement.value,
		{
			placement: 'bottom-end',
			modifiers: [
				{
					name: 'offset',
					options: {
						offset: [0, 4],
					},
				},
			],
		},
	);

	const { deleteViewedTaskController } = useAdapters();
	const isDeleteTaskDialogOpen = useSignal(false);

	return (
		<>
			<Popover className="relative float-right">
				<Popover.Button
					ref={(element) => (referenceElement.value = element)}
					className="ml-2 mt-1 flex h-6 w-6 items-center justify-center rounded-md hover:bg-gray-100"
				>
					<EllipsisVerticalIcon className="icon" />
				</Popover.Button>

				<Popover.Panel
					ref={(element) => (popperElement.value = element)}
					style={styles.popper}
					{...attributes.popper}
					className="absolute z-10 w-max overflow-hidden rounded-md border bg-white text-sm shadow-lg"
				>
					<ul>
						<li className="border-t first:border-t-0">
							<button
								className="flex w-full items-center py-1 pl-2 pr-4 hover:bg-gray-100"
								onClick={props.enableEditMode}
							>
								<div className="mr-2 flex h-6 w-6">
									<PencilIcon className="icon m-auto text-gray-700" />
								</div>
								Edit
							</button>
						</li>
						{/* <li className="border-t first:border-t-0">
						<label className="flex w-full cursor-pointer items-center py-1 pl-2 pr-4 hover:bg-gray-100">
							<div className="mr-2 flex h-6 w-6">
								<input
									type="checkbox"
									className="m-auto h-4 w-4 rounded focus:ring-2 focus:ring-gray-500"
								/>
							</div>
							<span>Show on Main Board</span>
						</label>
					</li> */}
						<li className="border-t first:border-t-0">
							<button
								className="flex w-full items-center py-1 pl-2 pr-4 hover:bg-gray-100"
								onClick={() => (isDeleteTaskDialogOpen.value = true)}
							>
								<div className="mr-2 flex h-6 w-6">
									<TrashIcon className="icon m-auto text-gray-700" />
								</div>
								Delete
							</button>
						</li>
					</ul>
				</Popover.Panel>
			</Popover>
			<DeleteTaskDialog
				isOpen={isDeleteTaskDialogOpen}
				delete={deleteViewedTaskController.run}
			/>
		</>
	);
}
