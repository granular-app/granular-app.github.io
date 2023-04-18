import { Popover } from '@headlessui/react';
import {
	PencilIcon,
	PlusCircleIcon,
	TrashIcon,
} from '@heroicons/react/24/outline';
import { EllipsisVerticalIcon, SparklesIcon } from '@heroicons/react/24/solid';
import { useSignal } from '@preact/signals-react';
import { usePopper } from 'react-popper';
import { Sidebar } from '../../ui/Sidebar';
import { SubtaskUIModel } from '../presenters/main-board-presenter';
import { useMainBoardState } from './use-main-board-state';

export function MainBoardPage() {
	return (
		<>
			<MainBoardSidebar />
			<Kanban />
		</>
	);
}

function MainBoardSidebar() {
	const mainBoard = useMainBoardState();

	return (
		<Sidebar>
			<h1 className="text-lg">Main Board</h1>
			<h3 className="mt-5 mb-1 text-sm font-bold text-gray-500">Status</h3>
			<div className="flex items-center justify-between">
				<span className="font-bold text-gray-700">{mainBoard.status}</span>
				<SparklesIcon className="icon ml-2" />
			</div>
			<div className="mb-2 h-1 w-full bg-gray-200">
				<div
					className="h-full bg-gray-400"
					style={{ width: `${mainBoard.progress * 100}%` }}
				>
					<div className="h-full w-full bg-repeat heropattern-diagonalstripes-gray-500"></div>
				</div>
			</div>
			<dl className="divide-y divide-gray-100 text-sm text-gray-600">
				<div className="grid grid-cols-2 py-px">
					<dt>Main Board tasks</dt>
					<dd>
						{mainBoard.mainBoardCompletedTasksCount} /{' '}
						{mainBoard.mainBoardTasksCount}
					</dd>
				</div>
				<div className="grid grid-cols-2 py-px">
					<dt>All tasks</dt>
					<dd>
						{mainBoard.allCompletedTasksCount} / {mainBoard.allTasksCount}
					</dd>
				</div>
			</dl>
		</Sidebar>
	);
}

function Kanban() {
	const mainBoard = useMainBoardState();

	return (
		<div className="w-full overflow-y-auto pl-80">
			<div className="flex w-full snap-x snap-mandatory overflow-x-auto p-6 pb-12 sm:snap-none">
				<div className="mr-3 w-4/5 flex-shrink-0 snap-center sm:w-64">
					<h3 className="mt-1 mb-2 px-2 text-sm font-bold text-gray-500">
						To do
					</h3>
					<ul>
						{mainBoard.subtasks.toDo.map((subtask, index) => (
							<SubtaskTile key={index} subtask={subtask} />
						))}
					</ul>
					<AddTaskButton />
				</div>
				<div className="mx-3 w-4/5 flex-shrink-0 snap-center sm:w-64">
					<h3 className="mt-1 mb-2 px-2 text-sm font-bold text-gray-500">
						In progress
					</h3>
					<ul>
						{mainBoard.subtasks.inProgress.map((subtask, index) => (
							<SubtaskTile key={index} subtask={subtask} />
						))}
					</ul>
					<AddTaskButton />
				</div>
				<div className="ml-3 w-4/5 flex-shrink-0 snap-center sm:w-64">
					<h3 className="mt-1 mb-2 px-2 text-sm font-bold text-gray-500">
						Completed
					</h3>
					<ul>
						{mainBoard.subtasks.completed.map((subtask, index) => (
							<SubtaskTile key={index} subtask={subtask} />
						))}
					</ul>
					<AddTaskButton />
				</div>
			</div>
		</div>
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

function SubtaskTile(props: { subtask: SubtaskUIModel }) {
	return (
		<li className="group relative mb-2 rounded bg-white p-2 shadow">
			<SubtaskTileActionsButton />
			<h4>{props.subtask.text}</h4>
		</li>
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
