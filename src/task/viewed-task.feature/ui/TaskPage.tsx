import { Popover } from '@headlessui/react';
import { PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { EllipsisVerticalIcon, SparklesIcon } from '@heroicons/react/24/solid';
import { useSignal } from '@preact/signals-react';
import { usePopper } from 'react-popper';
import { Link } from 'react-router-dom';
import { ProgressBar } from 'src/ui/ProgressBar';
import { Sidebar } from 'src/ui/Sidebar';
import { useUIDependencies } from 'src/ui/ui-dependencies';
import { TaskmapRoute } from '../../../ui/setup/router';
import { TaskKanban } from '../../ui/TaskKanban';
import { ParentTaskUIModel } from '../viewed-task.presenter';
import { useViewedTask } from './use-viewed-task';

export function TaskPage() {
	const viewedTask = useViewedTask();
	const { addViewedTaskSubtaskController, editViewedTaskSubtaskController } =
		useUIDependencies();

	return (
		<>
			<TaskSidebar />
			<TaskKanban
				columns={viewedTask.subtasks}
				addTask={addViewedTaskSubtaskController.run}
				editTask={editViewedTaskSubtaskController.run}
			/>
		</>
	);
}

function TaskSidebar() {
	const viewedTask = useViewedTask();

	return (
		<Sidebar>
			<h1 className="text-lg">
				{/* <ViewedTaskActionsButton /> */}
				{viewedTask.text}
			</h1>
			<h3 className="mt-5 mb-1 text-sm font-bold text-gray-500">Status</h3>
			<div className="flex items-center justify-between">
				<span className="font-bold text-gray-700">{viewedTask.status}</span>
				<SparklesIcon className="icon ml-2" />
			</div>
			<ProgressBar progress={viewedTask.progress} />
			<dl className="divide-y divide-gray-100 text-sm text-gray-600">
				<div className="grid grid-cols-2 py-px">
					<dt>Direct subtasks</dt>
					<dd>
						{viewedTask.directCompletedSubtasksCount} /{' '}
						{viewedTask.directSubtasksCount}
					</dd>
				</div>
				<div className="grid grid-cols-2 py-px">
					<dt>All subtasks</dt>
					<dd>
						{viewedTask.allCompletedSubtasksCount} /{' '}
						{viewedTask.allSubtasksCount}
					</dd>
				</div>
			</dl>
			{/* <h3 className="mt-5 mb-1 text-sm font-bold text-gray-500">Note</h3>
			<button className="button">Add note</button> */}
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
		</Sidebar>
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
