import { Popover } from '@headlessui/react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { EllipsisVerticalIcon } from '@heroicons/react/24/solid';
import { useSignal } from '@preact/signals-react';
import classNames from 'classnames';
import { useCallback } from 'react';
import { usePopper } from 'react-popper';
import { DeleteTaskDialog } from '../../delete-task.feature/DeleteTaskDialog';

export function TaskKanbanTileActionsButton(props: {
	enableEditMode: () => void;
	deleteTask: () => void;
}) {
	const isDeleteTaskDialogOpen = useSignal(false);
	const openDeleteTaskDialog = useCallback(() => {
		isDeleteTaskDialogOpen.value = true;
	}, [isDeleteTaskDialogOpen]);

	return (
		<>
			<TaskKanbanTileActionsPopover
				openDeleteTaskDialog={openDeleteTaskDialog}
				enableEditMode={props.enableEditMode}
			/>
			<DeleteTaskDialog
				isOpen={isDeleteTaskDialogOpen}
				delete={props.deleteTask}
			/>
		</>
	);
}
type PopperOptions = Parameters<typeof usePopper>['2'];
const taskKanbanTileActionsPopoverOptions: PopperOptions = {
	placement: 'bottom-end',
	modifiers: [
		{
			name: 'offset',
			options: {
				offset: [0, 4],
			},
		},
	],
} as const;
function TaskKanbanTileActionsPopover(props: {
	enableEditMode: () => void;
	openDeleteTaskDialog: () => void;
}) {
	const referenceElement = useSignal<HTMLElement | null>(null);
	const popperElement = useSignal<HTMLElement | null>(null);
	const { styles, attributes } = usePopper(
		referenceElement.value,
		popperElement.value,
		taskKanbanTileActionsPopoverOptions,
	);

	return (
		<Popover>
			{({ open: popoverIsOpen }) => (
				<>
					<Popover.Button
						ref={(element) => (referenceElement.value = element)}
						className={classNames(
							'kanban__task-tile-actions-button absolute right-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-md bg-white transition-opacity hover:bg-gray-100 focus:bg-gray-100 group-focus-within:opacity-100 group-hover:opacity-100',
							!popoverIsOpen && 'opacity-0',
						)}
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
							<li className="border-t first:border-t-0">
								<button
									className="flex w-full items-center py-1 pl-2 pr-4 hover:bg-gray-100"
									onClick={props.openDeleteTaskDialog}
								>
									<div className="mr-2 flex h-6 w-6">
										<TrashIcon className="icon m-auto text-gray-700" />
									</div>
									Delete
								</button>
							</li>
						</ul>
					</Popover.Panel>
				</>
			)}
		</Popover>
	);
}
