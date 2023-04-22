import { Popover, RadioGroup } from '@headlessui/react';
import { PencilIcon, XMarkIcon } from '@heroicons/react/24/outline';
import {
	CheckIcon,
	EllipsisVerticalIcon,
	SparklesIcon,
} from '@heroicons/react/24/solid';
import { useSignal } from '@preact/signals-react';
import classNames from 'classnames';
import { Fragment, useCallback } from 'react';
import { usePopper } from 'react-popper';
import { Link } from 'react-router-dom';
import { taskStatusesUIModel } from 'src/task/presenters/present-task-status';
import { emptyKanbanColumns } from 'src/task/ui-models/kanban-task';
import { TaskForm } from 'src/task/ui/TaskForm';
import { ProgressBar } from 'src/ui/ProgressBar';
import { Sidebar } from 'src/ui/Sidebar';
import { useUIDependencies } from 'src/ui/ui-dependencies';
import { TaskmapRoute } from '../../../ui/setup/router';
import { TaskKanban } from '../../ui/TaskKanban';
import {
	ParentTaskUIModel,
	ViewedTaskSubtasksUIModel,
} from '../viewed-task.presenter';
import { useViewedTask } from './use-viewed-task';

export function TaskPage() {
	return (
		<>
			<Sidebar>
				<TaskTextView />
				<StatusView />
				{/* <h3 className="mt-5 mb-1 text-sm font-bold text-gray-500">Note</h3>
			<button className="button">Add note</button> */}
				<ParentTasksView />
			</Sidebar>
			<ViewedTaskSubtasksKanban />
		</>
	);
}

function TaskTextView() {
	const { text } = useViewedTask();
	const editModeActive = useSignal(false);
	const enableEditMode = useCallback(() => {
		editModeActive.value = true;
	}, []);
	const disableEditMode = useCallback(() => {
		editModeActive.value = false;
	}, []);
	const { editViewedTaskController } = useUIDependencies();

	if (editModeActive.value) {
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
			<ViewedTaskActionsButton onEditButtonClick={enableEditMode} />
			{text}
		</h1>
	);
}

function ViewedTaskActionsButton(props: { onEditButtonClick: () => void }) {
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
							onClick={props.onEditButtonClick}
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
					</li>
					<li className="border-t first:border-t-0">
						<button className="flex w-full items-center py-1 pl-2 pr-4 hover:bg-gray-100">
							<div className="mr-2 flex h-6 w-6">
								<TrashIcon className="icon m-auto text-gray-700" />
							</div>
							Delete
						</button>
					</li> */}
				</ul>
			</Popover.Panel>
		</Popover>
	);
}

function StatusView() {
	const viewedTask = useViewedTask();

	return (
		<>
			<h3 className="mt-5 mb-1 text-sm font-bold text-gray-500">Status</h3>
			{viewedTask.maybeSubtasks
				.map((subtasks) => <SubtasksStatusView subtasks={subtasks} />)
				.orDefault(<StaticStatusView />)}
		</>
	);
}

function StaticStatusView() {
	const viewedTaskStaticStatus = useViewedTask().staticStatus;
	const { setViewedTaskStaticStatusController } = useUIDependencies();

	return (
		<RadioGroup
			value={viewedTaskStaticStatus}
			onChange={setViewedTaskStaticStatusController.run}
			defaultChecked
			className="my-2 rounded-md border text-gray-800"
		>
			{taskStatusesUIModel.map(({ label, value }) => {
				return (
					<RadioGroup.Option key={value} value={value} as={Fragment}>
						{({ checked }) => (
							<div
								className={classNames(
									'flex cursor-pointer items-center border-t p-2 first:border-t-0 hover:bg-gray-100',
									checked && 'bg-gray-100 font-bold text-gray-700',
								)}
							>
								<span className="flex-grow pr-2 pl-4">{label}</span>
								{checked && (
									<div className="ml-2 p-1 leading-[0]">
										<CheckIcon className="icon" />
									</div>
								)}
							</div>
						)}
					</RadioGroup.Option>
				);
			})}
		</RadioGroup>
	);
}

function SubtasksStatusView(props: { subtasks: ViewedTaskSubtasksUIModel }) {
	const viewedTask = useViewedTask();
	const {
		progress,
		directCompletedSubtasksCount,
		allCompletedSubtasksCount,
		allSubtasksCount,
		directSubtasksCount,
	} = props.subtasks;

	return (
		<>
			<div className="flex items-center justify-between">
				<span className="font-bold text-gray-700">
					{viewedTask.statusLabel}
				</span>
				<SparklesIcon className="icon ml-2" />
			</div>
			<ProgressBar progress={progress} />
			<dl className="divide-y divide-gray-100 text-sm text-gray-600">
				<div className="grid grid-cols-2 py-px">
					<dt>Direct subtasks</dt>
					<dd>
						{directCompletedSubtasksCount} / {directSubtasksCount}
					</dd>
				</div>
				<div className="grid grid-cols-2 py-px">
					<dt>All subtasks</dt>
					<dd>
						{allCompletedSubtasksCount} / {allSubtasksCount}
					</dd>
				</div>
			</dl>
		</>
	);
}

function ParentTasksView() {
	const viewedTask = useViewedTask();

	return (
		<>
			<h3 className="mt-5 mb-1 text-sm font-bold text-gray-500">
				Parent tasks
			</h3>
			<ul className="my-2 rounded-md border text-gray-800">
				{viewedTask.maybeParentTasks.caseOf({
					Just: (parentTasks) => (
						<>
							{parentTasks.map((parentTask) => {
								return (
									<ParentTaskTile key={parentTask.id} parentTask={parentTask} />
								);
							})}
						</>
					),
					Nothing: () => (
						<li className="flex items-center border-t p-2 first:border-t-0">
							<Link
								to={TaskmapRoute.MainBoard}
								className="flex-grow rounded-md pr-2 pl-4 hover:bg-gray-100"
							>
								Main Board
							</Link>
						</li>
					),
				})}
			</ul>
			{/* <button className="mt-2 flex w-full items-center rounded-md py-1 font-bold text-gray-700 hover:bg-gray-100">
				<div className="mr-2 flex h-6 w-6">
					<PlusIcon className="icon m-auto" />
				</div>
				Assign parent tasks
			</button> */}
		</>
	);
}

function ParentTaskTile(props: { parentTask: ParentTaskUIModel }) {
	return (
		<li className="flex items-center border-t p-2 first:border-t-0">
			<Link
				to={TaskmapRoute.Task.URL(props.parentTask.id)}
				className="flex-grow rounded-md pr-2 pl-4 hover:bg-gray-100"
			>
				{props.parentTask.text}
			</Link>
			<button className="ml-2 rounded-md p-1 leading-[0] hover:bg-gray-100">
				<XMarkIcon className="icon" />
			</button>
		</li>
	);
}

function ViewedTaskSubtasksKanban() {
	const viewedTask = useViewedTask();
	const { addViewedTaskSubtaskController, editViewedTaskSubtaskController } =
		useUIDependencies();

	return (
		<TaskKanban
			columns={viewedTask.maybeSubtasks
				.map((subtasks) => subtasks.byStatus)
				.orDefault(emptyKanbanColumns)}
			addTask={addViewedTaskSubtaskController.run}
			editTask={editViewedTaskSubtaskController.run}
		/>
	);
}
