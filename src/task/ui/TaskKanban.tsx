import { Popover } from '@headlessui/react';
import { PencilIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import { EllipsisVerticalIcon } from '@heroicons/react/24/solid';
import { useSignal } from '@preact/signals-react';
import classNames from 'classnames';
import { useCallback } from 'react';
import { usePopper } from 'react-popper';
import { Link } from 'react-router-dom';
import { TaskmapRoute } from '../../ui/setup/router';
import { TaskStatus } from '../core/task-status';
import { EditTaskController } from '../edit-task.feature/edit-task.controller';
import {
	KanbanColumnsUIModel,
	KanbanTaskUIModel,
} from '../ui-models/kanban-task';
import { TaskForm } from './TaskForm';

export function TaskKanban(props: {
	columns: KanbanColumnsUIModel;
	addTask: (text: string, options: { status: TaskStatus }) => void;
	editTask: EditTaskController['run'];
}) {
	return (
		<div className="w-full overflow-y-auto pl-80">
			<div className="flex w-full snap-x snap-mandatory overflow-x-auto p-6 pb-12 sm:snap-none">
				<div className="mr-3 w-4/5 flex-shrink-0 snap-center sm:w-64">
					<h3 className="mt-1 mb-2 px-2 text-sm font-bold text-gray-500">
						To do
					</h3>
					<KanbanColumnTaskTiles
						column={props.columns.toDo}
						editTask={props.editTask}
					/>
					<AddTaskButton
						onSubmit={(taskText) =>
							props.addTask(taskText, { status: TaskStatus.ToDo })
						}
					/>
				</div>
				<div className="mx-3 w-4/5 flex-shrink-0 snap-center sm:w-64">
					<h3 className="mt-1 mb-2 px-2 text-sm font-bold text-gray-500">
						In progress
					</h3>
					<KanbanColumnTaskTiles
						column={props.columns.inProgress}
						editTask={props.editTask}
					/>
					<AddTaskButton
						onSubmit={(taskText) =>
							props.addTask(taskText, { status: TaskStatus.InProgress })
						}
					/>
				</div>
				<div className="ml-3 w-4/5 flex-shrink-0 snap-center sm:w-64">
					<h3 className="mt-1 mb-2 px-2 text-sm font-bold text-gray-500">
						Completed
					</h3>
					<KanbanColumnTaskTiles
						column={props.columns.completed}
						editTask={props.editTask}
					/>
					<AddTaskButton
						onSubmit={(taskText) =>
							props.addTask(taskText, { status: TaskStatus.Completed })
						}
					/>
				</div>
			</div>
		</div>
	);
}

function KanbanColumnTaskTiles(props: {
	column: KanbanTaskUIModel[];
	editTask: (taskID: string, newText: string) => void;
}) {
	return (
		<ul>
			{props.column.map((task, index) => (
				<KanbanTaskTile key={index} task={task} editTask={props.editTask} />
			))}
		</ul>
	);
}

function AddTaskButton(props: { onSubmit: (text: string) => void }) {
	const formVisisble = useSignal(false);
	const openForm = () => (formVisisble.value = true);
	const closeForm = useCallback(() => (formVisisble.value = false), []);

	if (formVisisble.value) {
		return (
			<TaskForm
				initialText=""
				onClose={closeForm}
				onSubmit={props.onSubmit}
				submitLabel="Add task"
			/>
		);
	}

	return (
		<button
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

export function KanbanTaskTile(props: {
	task: KanbanTaskUIModel;
	editTask: (taskID: string, newText: string) => void;
}) {
	const editModeActive = useSignal(false);
	const enableEditMode = useCallback(() => {
		editModeActive.value = true;
	}, []);
	const disableEditMode = useCallback(() => {
		editModeActive.value = false;
	}, []);
	const editTask = useCallback((newText: string) => {
		props.editTask(props.task.id, newText);
	}, []);

	if (editModeActive.value) {
		return (
			<TaskForm
				initialText={props.task.text}
				onClose={disableEditMode}
				onSubmit={editTask}
				submitLabel="Save"
				extraClassName="mt-2 mb-4"
			/>
		);
	}

	return (
		<li className="group relative mb-2 rounded bg-white p-2 shadow">
			<KanbakTaskTileActionsButton onEditButtonClick={enableEditMode} />
			<Link
				to={TaskmapRoute.Task.URL(props.task.id)}
				className="block rounded-md hover:bg-zinc-100"
			>
				{props.task.text}
			</Link>
		</li>
	);
}

// function KanbanTaskTileWithProgressBar() {
// 	return (
// 		<div className="group relative mb-2 rounded bg-white p-2 shadow">
// 			<KanbakTaskTileActionsButton onEditButtonClick={() => {}} />
// 			<SparklesIcon className="icon float-right mt-2 ml-2" />
// 			<h4>Task tile with progress bar</h4>
// 			<div className="absolute bottom-0 left-0 h-0.5 w-full overflow-hidden rounded-b bg-gray-200">
// 				<div
// 					className="h-full bg-gray-400"
// 					style={{
// 						width: `75%`,
// 					}}
// 				>
// 					<div className="h-full bg-repeat heropattern-diagonalstripes-gray-500"></div>
// 				</div>
// 			</div>
// 		</div>
// 	);
// }

export function KanbakTaskTileActionsButton(props: {
	onEditButtonClick: () => void;
}) {
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

	return (
		<Popover>
			{({ open: popoverIsOpen }) => (
				<>
					<Popover.Button
						ref={(element) => (referenceElement.value = element)}
						className={classNames(
							'kanban__task-tile-actions-button absolute right-2 z-10 flex h-6 w-6 items-center justify-center rounded-md bg-white transition-opacity hover:bg-gray-100 group-hover:opacity-100',
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
									onClick={props.onEditButtonClick}
								>
									<div className="mr-2 flex h-6 w-6">
										<PencilIcon className="icon m-auto text-gray-700" />
									</div>
									Edit
								</button>
							</li>
							{/* <li className="border-t first:border-t-0">
								<button className="flex w-full items-center py-1 pl-2 pr-4 hover:bg-gray-100">
									<div className="mr-2 flex h-6 w-6">
										<TrashIcon className="icon m-auto text-gray-700" />
									</div>
									Delete
								</button>
							</li> */}
						</ul>
					</Popover.Panel>
				</>
			)}
		</Popover>
	);
}
