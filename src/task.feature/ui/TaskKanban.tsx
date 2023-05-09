import {
	DndContext,
	DragEndEvent,
	DragOverlay,
	DragStartEvent,
	PointerSensor,
	useDroppable,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import { Popover } from '@headlessui/react';
import {
	PencilIcon,
	PlusCircleIcon,
	TrashIcon,
} from '@heroicons/react/24/outline';
import { EllipsisVerticalIcon, SparklesIcon } from '@heroicons/react/24/solid';
import { useComputed, useSignal } from '@preact/signals-react';
import classNames from 'classnames';
import { Just, Maybe, Nothing } from 'purify-ts';
import { ElementType, ReactNode, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { usePopper } from 'react-popper';
import { Link } from 'react-router-dom';
import { ProgressBar } from 'src/ui/ProgressBar';
import { Draggable } from 'src/utils/ui/Draggable';
import { runOnNextFrame } from 'src/utils/ui/run-on-next-frame';
import { AppRoute } from '../../ui/setup/router';
import { TaskStatus, taskStatuses } from '../core/task-status';
import { DeleteTaskController } from '../delete-task.feature/delete-task.controller';
import { DeleteTaskDialog } from '../delete-task.feature/DeleteTaskDialog';
import { EditTaskController } from '../edit-task.feature/edit-task.controller';
import {
	taskStatusesUIModel,
	TaskStatusUIModel,
} from '../presenters/present-task-status';
import { SetStaticStatusController } from '../set-static-status.feature/set-static-status.controller';
import {
	KanbanColumnsUIModel,
	KanbanTaskUIModel,
} from '../ui-models/kanban-task';
import { TaskForm } from './TaskForm';

export function TaskKanban(props: {
	columns: KanbanColumnsUIModel;
	addTask: (params: { text: string; status: TaskStatus }) => void;
	editTask: EditTaskController['run'];
	deleteTask: DeleteTaskController['run'];
	setStaticStatus: SetStaticStatusController['run'];
}) {
	return (
		<TaskKanbanDragAndDrop
			columns={props.columns}
			setStaticStatus={props.setStaticStatus}
		>
			<div className="w-full overflow-y-auto pl-80">
				<div className="flex w-full snap-x snap-mandatory items-start overflow-x-auto p-6 pb-12 sm:snap-none">
					{taskStatusesUIModel.map((status) => (
						<KanbanColumn
							status={status}
							column={props.columns[status.value]}
							{...props}
						/>
					))}
				</div>
			</div>
		</TaskKanbanDragAndDrop>
	);
}

function KanbanColumn(props: {
	status: TaskStatusUIModel;
	column: KanbanTaskUIModel[];
	addTask: (params: { text: string; status: TaskStatus }) => void;
	editTask: EditTaskController['run'];
	deleteTask: DeleteTaskController['run'];
}) {
	const droppable = useDroppable({
		id: props.status.value,
	});

	return (
		<div
			key={props.status.value}
			ref={droppable.setNodeRef}
			className={classNames(
				'mr-3 w-4/5 flex-shrink-0 snap-center rounded sm:w-64',
				droppable.isOver && 'ring-2 ring-zinc-500 ring-offset-4',
			)}
		>
			<h3 className="mt-1 mb-2 text-sm font-bold text-gray-500">
				{props.status.label}
			</h3>
			<KanbanColumnTaskTiles
				column={props.column}
				editTask={props.editTask}
				deleteTask={props.deleteTask}
			/>
			<AddTaskButton
				onSubmit={(text) => props.addTask({ text, status: props.status.value })}
			/>
		</div>
	);
}

function KanbanColumnTaskTiles(props: {
	column: KanbanTaskUIModel[];
	editTask: (taskID: string, newText: string) => void;
	deleteTask: (taskID: string) => void;
}) {
	return (
		<ul>
			{props.column.map((task, index) => (
				<KanbanTaskTile
					key={index}
					task={task}
					editTask={props.editTask}
					deleteTask={props.deleteTask}
				/>
			))}
		</ul>
	);
}

function AddTaskButton(props: { onSubmit: (text: string) => void }) {
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

export function KanbanTaskTile(props: {
	task: KanbanTaskUIModel;
	editTask: (taskID: string, newText: string) => void;
	deleteTask: (taskID: string) => void;
	extraClassName?: string;
	element?: ElementType;
}) {
	const editModeEnabled = useSignal(false);
	const enableEditMode = useCallback(() => {
		editModeEnabled.value = true;
	}, []);
	const disableEditMode = useCallback(() => {
		editModeEnabled.value = false;
	}, []);
	const editTask = useCallback((newText: string) => {
		props.editTask(props.task.id, newText);
	}, []);

	if (editModeEnabled.value) {
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
		<Draggable
			id={props.task.id}
			element={props.element ?? 'li'}
			className={classNames(
				'group relative mb-2 rounded bg-white shadow',
				props.extraClassName,
			)}
			disabled={props.task.maybeProgress.isJust()}
		>
			<KanbanTaskTileContents enableEditMode={enableEditMode} {...props} />
			{props.task.maybeProgress
				.map((progress) => (
					<ProgressBar
						progress={progress}
						className="-mt-0.5 h-0.5 rounded-b"
					/>
				))
				.extract()}
		</Draggable>
	);
}

function KanbanTaskTileContents(props: {
	task: KanbanTaskUIModel;
	deleteTask: (taskID: string) => void;
	enableEditMode: () => void;
}) {
	return (
		<div className="p-2">
			<Link
				to={AppRoute.Task.URL(props.task.id)}
				className="block rounded-md hover:bg-zinc-100"
			>
				{props.task.maybeProgress.isJust() && (
					<SparklesIcon className="icon float-right ml-2 mt-1 text-gray-600" />
				)}
				<span>{props.task.text}</span>
			</Link>
			<KanbakTaskTileActionsButton
				enableEditMode={props.enableEditMode}
				deleteTask={() => props.deleteTask(props.task.id)}
			/>
		</div>
	);
}

export function KanbakTaskTileActionsButton(props: {
	enableEditMode: () => void;
	deleteTask: () => void;
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

	const isDeleteTaskDialogOpen = useSignal(false);

	return (
		<>
			<Popover>
				{({ open: popoverIsOpen }) => (
					<>
						<Popover.Button
							ref={(element) => (referenceElement.value = element)}
							className={classNames(
								'kanban__task-tile-actions-button absolute right-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-md bg-white transition-opacity hover:bg-gray-100 group-focus-within:opacity-100 group-hover:opacity-100',
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
					</>
				)}
			</Popover>
			<DeleteTaskDialog
				isOpen={isDeleteTaskDialogOpen}
				delete={props.deleteTask}
			/>
		</>
	);
}

function TaskKanbanDragAndDrop(props: {
	children: ReactNode;
	columns: KanbanColumnsUIModel;
	setStaticStatus: SetStaticStatusController['run'];
}) {
	const { handleDragStart, handleDragEnd, dndSensors, draggedTask } =
		useTaskDragAndDrop(props.columns, props.setStaticStatus);

	return (
		<DndContext
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
			sensors={dndSensors}
		>
			{props.children}
			{createPortal(
				<DragOverlay>
					{draggedTask.value
						.map((task) => (
							<KanbanTaskTile
								task={task}
								extraClassName="shadow-lg"
								element="div"
								deleteTask={() => {}}
								editTask={() => {}}
							/>
						))
						.extract()}
				</DragOverlay>,
				document.body,
			)}
		</DndContext>
	);
}
function useTaskDragAndDrop(
	columns: KanbanColumnsUIModel,
	setStaticStatus: SetStaticStatusController['run'],
) {
	const subtasks = taskStatuses.flatMap((status) => columns[status]);
	const getTask = (id: string): KanbanTaskUIModel => {
		return subtasks.find((subtask) => subtask.id === id)!;
	};

	const draggedTaskID = useSignal<Maybe<string>>(Nothing);
	const draggedTask = useComputed(() => draggedTaskID.value.map(getTask));
	const dndSensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		}),
	);

	return {
		handleDragStart,
		handleDragEnd,
		draggedTask,
		dndSensors,
	};

	function handleDragStart(event: DragStartEvent) {
		draggedTaskID.value = Just(event.active.id.toString());
	}

	function handleDragEnd(event: DragEndEvent) {
		draggedTaskID.value = Nothing;

		if (event.over === null) return;

		const status = event.over.id as TaskStatus;
		const taskID = event.active.id as string;

		console.log(
			`dragged task with id ${taskID} and changed status to ${status}`,
		);
		setStaticStatus(taskID, status);
	}
}
