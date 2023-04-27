import { Combobox } from '@headlessui/react';
import {
	ChevronUpDownIcon,
	PlusIcon,
	XMarkIcon,
} from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/24/solid';
import { Signal, useComputed, useSignal } from '@preact/signals-react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { useAdapters } from 'src/ui/adapaters';
import { AppRoute } from '../../../ui/setup/router';
import { ParentTaskUIModel } from '../viewed-task.presenter';
import { useViewedTask } from './use-viewed-task';

export function ParentTasksView() {
	return (
		<>
			<h3 className="mt-5 mb-1 text-sm font-bold text-gray-500">
				Parent tasks
			</h3>
			<ParentTasksList />
			<AttachParentTaskArea />
		</>
	);
}

function ParentTasksList() {
	const { parentTasks } = useViewedTask();

	return (
		<ul className="my-2 rounded-md border text-gray-800">
			{parentTasks.map((parentTask) => (
				<ParentTaskTile key={parentTask.id} parentTask={parentTask} />
			))}
		</ul>
	);
}

function ParentTaskTile(props: { parentTask: ParentTaskUIModel }) {
	const viewedTask = useViewedTask();
	const url =
		props.parentTask.id === 'main-board'
			? AppRoute.MainBoard
			: AppRoute.Task.URL(props.parentTask.id);

	return (
		<li className="flex items-center border-t p-2 first:border-t-0">
			<Link
				to={url}
				className="flex-grow rounded-md pr-2 pl-4 hover:bg-gray-100"
			>
				{props.parentTask.text}
			</Link>
			{viewedTask.canDetachFromParentTasks && (
				<DetachFromParentTaskButton id={props.parentTask.id} />
			)}
		</li>
	);
}

function DetachFromParentTaskButton(props: { id: string }) {
	const { detachViewedTaskController } = useAdapters();

	return (
		<button
			className="ml-2 rounded-md p-1 leading-[0] hover:bg-gray-100"
			onClick={() => detachViewedTaskController.run(props.id)}
		>
			<XMarkIcon className="icon" />
		</button>
	);
}

function AttachParentTaskArea() {
	const newParentTask = useSignal<{ id: string; text: string } | null>(null);

	return (
		<div className="flex">
			<NewParentTaskSelector newParentTask={newParentTask} />
			<AttachToParentTaskButton newParentTask={newParentTask} />
		</div>
	);
}

function NewParentTaskSelector(props: {
	newParentTask: Signal<{ id: string; text: string } | null>;
}) {
	const query = useSignal('');
	const candidates = useQueryParentTaskCandidates(query);

	return (
		<Combobox
			value={props.newParentTask.value}
			onChange={(newValue) => (props.newParentTask.value = newValue)}
			nullable
		>
			<div className="relative w-full">
				<div className="relative w-full cursor-default overflow-hidden rounded-lg border bg-white text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-300 sm:text-sm">
					<Combobox.Input
						className="w-full border-none py-2 pl-6 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
						onChange={(event) => (query.value = event.target.value)}
						displayValue={(
							candidate: {
								text: string;
							} | null,
						) => candidate?.text ?? ''}
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
					{candidates.length === 0 && (
						<div className="p-4 text-center text-xl text-gray-400">
							Not found
						</div>
					)}
					{candidates.map((candidate) => (
						<NewParentTaskSelectorOption
							key={candidate.id}
							candidate={candidate}
						/>
					))}
				</Combobox.Options>
			</div>
		</Combobox>
	);
}

function NewParentTaskSelectorOption(props: {
	candidate: { id: string; text: string };
}) {
	return (
		<Combobox.Option
			value={props.candidate}
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
						{props.candidate.text}
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
	);
}

function AttachToParentTaskButton(props: {
	newParentTask: Signal<{ id: string; text: string } | null>;
}) {
	const { attachViewedTaskController } = useAdapters();

	return (
		<button
			className="ml-2 flex flex-shrink-0 items-center rounded-md border bg-gray-800 px-3 font-bold text-gray-200 shadow-md transition hover:bg-gray-700 disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none disabled:hover:bg-gray-100"
			onClick={() => {
				attachViewedTaskController.run(props.newParentTask.value!.id);
				props.newParentTask.value = null;
			}}
			disabled={props.newParentTask.value === null}
		>
			<PlusIcon className="m-auto h-4 w-4" />
		</button>
	);
}

function useQueryParentTaskCandidates(query: Signal<string>) {
	const { forceGetViewedTask } = useAdapters();

	return useComputed(() => {
		const { parentTaskCandidates } = forceGetViewedTask();
		const lowerCaseQuery = query.value.toLowerCase();

		return query.value === ''
			? parentTaskCandidates
			: parentTaskCandidates.filter(({ text }) => {
					return text.toLowerCase().includes(lowerCaseQuery);
			  });
	}).value;
}
