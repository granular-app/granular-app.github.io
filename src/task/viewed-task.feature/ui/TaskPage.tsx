import { Combobox, Popover, RadioGroup } from '@headlessui/react';
import {
	ChevronUpDownIcon,
	PencilIcon,
	PlusIcon,
	TrashIcon,
	XMarkIcon,
} from '@heroicons/react/24/outline';
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
import { DeleteTaskDialog } from 'src/task/delete-task.feature/DeleteTaskDialog';
import { taskStatusesUIModel } from 'src/task/presenters/present-task-status';
import { emptyKanbanColumns } from 'src/task/ui-models/kanban-task';
import { TaskForm } from 'src/task/ui/TaskForm';
import { useAdapters } from 'src/ui/adapaters';
import { ProgressBar } from 'src/ui/ProgressBar';
import { Sidebar } from 'src/ui/Sidebar';
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

function ViewedTaskActionsButton(props: { enableEditMode: () => void }) {
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
	const { setViewedTaskStaticStatusController } = useAdapters();

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
				{viewedTask.isMainBoardTask && (
					<li className="flex items-center border-t p-2 first:border-t-0">
						<Link
							to={TaskmapRoute.MainBoard}
							className="flex-grow rounded-md pr-2 pl-4 hover:bg-gray-100"
						>
							Main Board
						</Link>
						{viewedTask.parentTasks.length > 0 && (
							<button className="ml-2 rounded-md p-1 leading-[0] hover:bg-gray-100">
								<XMarkIcon className="icon" />
							</button>
						)}
					</li>
				)}
				{viewedTask.parentTasks.map((parentTask) => {
					return <ParentTaskTile key={parentTask.id} parentTask={parentTask} />;
				})}
			</ul>
			<ParentTaskCandidatesCombobox />
		</>
	);
}

function ParentTaskCandidatesCombobox() {
	const viewedTask = useViewedTask();
	const { addViewedTaskParentTaskController } = useAdapters();
	const candidates = viewedTask.parentTaskCandidates;
	const selectedCandidate = useSignal<{ id: string; text: string } | null>(
		null,
	);
	const query = useSignal('');

	const filteredCandidates =
		query.value === ''
			? candidates
			: candidates.filter((candidate) => {
					return candidate.text
						.toLowerCase()
						.includes(query.value.toLowerCase());
			  });

	return (
		<div className="flex">
			<Combobox
				value={selectedCandidate.value}
				onChange={(newValue) => (selectedCandidate.value = newValue)}
				nullable
			>
				<div className="relative w-full">
					<div className="relative w-full cursor-default overflow-hidden rounded-lg border bg-white text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-300 sm:text-sm">
						<Combobox.Input
							className="w-full border-none py-2 pl-6 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
							onChange={(event) => (query.value = event.target.value)}
							displayValue={(candidate: { text: string } | null) =>
								candidate?.text ?? ''
							}
							placeholder="New parent task"
						/>
						<Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
							<ChevronUpDownIcon
								className="h-5 w-5 text-gray-400"
								aria-hidden="true"
							/>
						</Combobox.Button>
					</div>
					<Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
						{filteredCandidates.length === 0 && (
							<div className="p-4 text-center text-xl text-gray-400">
								Not found
							</div>
						)}
						{filteredCandidates.map((candidate) => (
							<Combobox.Option
								key={candidate.id}
								value={candidate}
								className={({ selected }) =>
									classNames(
										'relative flex cursor-pointer select-none py-2 pl-6 pr-4 text-gray-700',
										selected && 'bg-gray-100',
									)
								}
							>
								{({ selected }) => (
									<>
										<span
											className={classNames(
												`block w-full truncate`,
												selected ? 'font-medium' : 'font-normal',
											)}
										>
											{candidate.text}
										</span>
										{selected && (
											<span
												className={classNames(
													`inset-y-0 flex flex-shrink-0 items-center pl-3`,
												)}
											>
												<CheckIcon className="icon" aria-hidden="true" />
											</span>
										)}
									</>
								)}
							</Combobox.Option>
						))}
					</Combobox.Options>
				</div>
			</Combobox>
			<button
				className="ml-2 flex flex-shrink-0 items-center rounded-md border bg-gray-800 px-3 font-bold text-gray-200 shadow-md transition hover:bg-gray-700 disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none disabled:hover:bg-gray-100"
				onClick={() => {
					addViewedTaskParentTaskController.run(selectedCandidate.value!.id);
					selectedCandidate.value = null;
				}}
				disabled={selectedCandidate.value === null}
			>
				<PlusIcon className="m-auto h-4 w-4" />
			</button>
		</div>
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
	const {
		addViewedTaskSubtaskController,
		editViewedTaskSubtaskController,
		deleteSubtaskController,
	} = useAdapters();

	return (
		<TaskKanban
			columns={viewedTask.maybeSubtasks
				.map((subtasks) => subtasks.byStatus)
				.orDefault(emptyKanbanColumns)}
			addTask={addViewedTaskSubtaskController.run}
			editTask={editViewedTaskSubtaskController.run}
			deleteTask={deleteSubtaskController.run}
		/>
	);
}
