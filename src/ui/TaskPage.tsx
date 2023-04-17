import { Popover } from '@headlessui/react';
import {
	LinkIcon,
	PencilIcon,
	PlusCircleIcon,
	TrashIcon,
	XMarkIcon,
} from '@heroicons/react/24/outline';
import { EllipsisVerticalIcon, SparklesIcon } from '@heroicons/react/24/solid';
import { useSignal } from '@preact/signals-react';
import { usePopper } from 'react-popper';

export function TaskPage() {
	return (
		<>
			<Sidebar />
			<Kanban />
		</>
	);
}

function Sidebar() {
	return (
		<aside className="fixed top-10 bottom-0 z-10 w-80 flex-shrink-0 overflow-y-auto p-6 pb-12">
			<h1 className="text-lg">
				<ViewedTaskActionsButton />
				Task
			</h1>
			<h3 className="mt-5 mb-1 text-sm font-bold text-gray-500">Status</h3>
			<div className="flex items-center justify-between">
				<span className="font-bold text-gray-700">In progress</span>
				<SparklesIcon className="icon ml-2" />
			</div>
			<div className="mb-2 h-1 w-full bg-gray-200">
				<div
					className="h-full bg-gray-400"
					style={{ width: `${(123 / 1241) * 100}%` }}
				>
					<div className="h-full w-full bg-repeat heropattern-diagonalstripes-gray-500"></div>
				</div>
			</div>
			<dl className="divide-y divide-gray-100 text-sm text-gray-600">
				<div className="grid grid-cols-2 py-px">
					<dt>Direct subtasks</dt>
					<dd>35 / 41</dd>
				</div>
				<div className="grid grid-cols-2 py-px">
					<dt>All subtasks</dt>
					<dd>123 / 1241</dd>
				</div>
			</dl>
			<h3 className="mt-5 mb-1 text-sm font-bold text-gray-500">Note</h3>
			<button className="button">Add note</button>
			<h3 className="mt-5 mb-1 text-sm font-bold text-gray-500">
				Parent tasks
			</h3>
			<ul className="my-2 rounded-md border text-gray-800">
				<ParentTaskTile />
				<ParentTaskTile />
				<ParentTaskTile />
				<ParentTaskTile />
				<ParentTaskTile />
				<ParentTaskTile />
			</ul>
			<button className="mt-2 flex w-full items-center rounded-md py-1 font-bold text-gray-700 hover:bg-gray-100">
				<div className="mr-2 flex h-6 w-6">
					<LinkIcon className="icon m-auto" />
				</div>
				Link to more tasks
			</button>
		</aside>
	);
}

function Kanban() {
	return (
		<div className="w-full overflow-y-auto pl-80">
			<div className="flex w-full snap-x snap-mandatory overflow-x-auto p-6 pb-12 sm:snap-none">
				<div className="mr-3 w-4/5 flex-shrink-0 snap-center sm:w-64">
					<h3 className="mt-1 mb-2 px-2 text-sm font-bold text-gray-500">
						To do
					</h3>
					<div>
						<SubtaskTile />
						<SubtaskTileWithProgressBar />
						<SubtaskTile />
						<SubtaskTile />
						<SubtaskTile />
						<SubtaskTile />
						<SubtaskTile />
						<SubtaskTile />
						<SubtaskTile />
						<SubtaskTile />
						<SubtaskTile />
						<SubtaskTile />
						<SubtaskTile />
						<SubtaskTile />
						<AddTaskButton />
					</div>
				</div>
				<div className="mx-3 w-4/5 flex-shrink-0 snap-center sm:w-64">
					<h3 className="mt-1 mb-2 px-2 text-sm font-bold text-gray-500">
						In progress
					</h3>
					<div>
						<SubtaskTile />
						<SubtaskTile />
						<SubtaskTile />
						<SubtaskTile />
						<SubtaskTile />
						<SubtaskTile />
						<SubtaskTile />
						<SubtaskTile />
						<SubtaskTile />
						<SubtaskTile />
						<SubtaskTile />
						<SubtaskTile />
						<SubtaskTile />
						<SubtaskTile />
						<AddTaskButton />
					</div>
				</div>
				<div className="ml-3 w-4/5 flex-shrink-0 snap-center sm:w-64">
					<h3 className="mt-1 mb-2 px-2 text-sm font-bold text-gray-500">
						Completed
					</h3>
					<div>
						<SubtaskTile />
						<SubtaskTile />
						<SubtaskTile />
						<SubtaskTile />
						<SubtaskTile />
						<SubtaskTile />
						<SubtaskTile />
						<SubtaskTile />
						<SubtaskTile />
						<SubtaskTile />
						<SubtaskTile />
						<SubtaskTile />
						<SubtaskTile />
						<SubtaskTile />
						<AddTaskButton />
					</div>
				</div>
			</div>
		</div>
	);
}

function ParentTaskTile() {
	return (
		<li className="flex items-center border-t p-2 first:border-t-0">
			<span className="flex-grow rounded-md pr-2 pl-4 hover:bg-gray-100">
				Parent task A
			</span>
			<button className="ml-2 rounded-md p-1 leading-[0] hover:bg-gray-100">
				<XMarkIcon className="icon" />
			</button>
		</li>
	);
}

function AddTaskButton() {
	return (
		<button className="mt-4 flex w-full items-center rounded-md py-1 font-bold text-gray-700 hover:bg-gray-100">
			<div className="mr-2 flex h-6 w-6">
				<PlusCircleIcon className="icon m-auto" />
			</div>
			Add task
		</button>
	);
}

function ViewedTaskActionsButton() {
	const referenceElement = useSignal<HTMLElement | null>(null);
	const popperElement = useSignal<HTMLElement | null>(null);
	const { styles, attributes } = usePopper(
		referenceElement.value,
		popperElement.value,
		{
			placement: 'bottom-end',
		},
	);

	return (
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
				className="absolute z-10 mt-1 w-max overflow-hidden rounded-md border bg-white text-sm shadow-lg"
			>
				<ul>
					<li className="border-t first:border-t-0">
						<button className="flex w-full items-center px-2 py-1 hover:bg-gray-100">
							<div className="mr-2 flex h-6 w-6">
								<PencilIcon className="icon m-auto text-gray-700" />
							</div>
							Edit
						</button>
					</li>
					<li className="border-t first:border-t-0">
						<label className="flex w-full cursor-pointer items-center px-2 py-1 hover:bg-gray-100">
							<div className="mr-2 flex h-6 w-6">
								<input
									type="checkbox"
									className="m-auto h-4 w-4 rounded focus:ring-2 focus:ring-gray-500"
								/>
							</div>
							<span>Show on Main Board</span>
						</label>
					</li>
					<li className="border-t first:border-t-0">
						<button className="flex w-full items-center px-2 py-1 hover:bg-gray-100">
							<div className="mr-2 flex h-6 w-6">
								<TrashIcon className="icon m-auto text-gray-700" />
							</div>
							Delete
						</button>
					</li>
				</ul>
			</Popover.Panel>
		</Popover>
	);
}

function SubtaskTile() {
	return (
		<div className="group relative mb-2 rounded bg-white p-2 shadow">
			<SubtaskTileActionsButton />
			<h4>Subtask tile</h4>
		</div>
	);
}

function SubtaskTileWithProgressBar() {
	return (
		<div className="group relative mb-2 rounded bg-white p-2 shadow">
			<SubtaskTileActionsButton />
			<SparklesIcon className="icon float-right mt-2 ml-2" />
			<h4>Subtask tile with progress bar</h4>
			<div className="absolute bottom-0 left-0 h-0.5 w-full overflow-hidden rounded-b bg-gray-200">
				<div
					className="h-full bg-gray-400"
					style={{
						width: `75%`,
					}}
				>
					<div className="h-full bg-repeat heropattern-diagonalstripes-gray-500"></div>
				</div>
			</div>
		</div>
	);
}

function SubtaskTileActionsButton() {
	const referenceElement = useSignal<HTMLElement | null>(null);
	const popperElement = useSignal<HTMLElement | null>(null);
	const { styles, attributes } = usePopper(
		referenceElement.value,
		popperElement.value,
		{
			placement: 'bottom-end',
		},
	);

	return (
		<Popover className="subtask-tile__actions-button absolute right-2 z-10 bg-white opacity-0 transition-opacity group-hover:opacity-100">
			<Popover.Button
				ref={(element) => (referenceElement.value = element)}
				className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-gray-100"
			>
				<EllipsisVerticalIcon className="icon" />
			</Popover.Button>

			<Popover.Panel
				ref={(element) => (popperElement.value = element)}
				style={styles.popper}
				{...attributes.popper}
				className="absolute z-10 mt-1 w-max overflow-hidden rounded-md border bg-white text-sm shadow-lg"
			>
				<ul>
					<li className="border-t first:border-t-0">
						<button className="flex w-full items-center px-2 py-1 hover:bg-gray-100">
							<div className="mr-2 flex h-6 w-6">
								<PencilIcon className="icon m-auto text-gray-700" />
							</div>
							Edit
						</button>
					</li>
					<li className="border-t first:border-t-0">
						<button className="flex w-full items-center px-2 py-1 hover:bg-gray-100">
							<div className="mr-2 flex h-6 w-6">
								<TrashIcon className="icon m-auto text-gray-700" />
							</div>
							Delete
						</button>
					</li>
				</ul>
			</Popover.Panel>
		</Popover>
	);
}
