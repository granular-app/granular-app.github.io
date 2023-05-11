import { RadioGroup } from '@headlessui/react';
import { CheckIcon, SparklesIcon } from '@heroicons/react/24/solid';
import classNames from 'classnames';
import { Fragment } from 'react';
import { taskStatusesUIModel } from 'src/task.feature/presenters/present-task-status';
import { useAdapters } from 'src/ui/adapaters';
import { ProgressBar } from 'src/ui/ProgressBar';
import { ViewedTaskSubtasksUIModel } from '../viewed-task.presenter';
import { useViewedTask } from './use-viewed-task';

export function StatusView() {
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
	const { deepSubtasks, directSubtasksCompletedCount, directSubtasksCount } =
		props.subtasks;

	return (
		<>
			<div className="flex items-center justify-between">
				<span className="font-bold text-gray-700">
					{viewedTask.statusLabel}
				</span>
				<SparklesIcon className="icon ml-2" />
			</div>
			<ProgressBar progress={deepSubtasks.progress} className="mb-2 h-1" />
			<dl className="divide-y divide-gray-100 text-sm text-gray-600">
				<div className="grid grid-cols-2 py-px">
					<dt>Direct subtasks</dt>
					<dd>
						{directSubtasksCompletedCount} / {directSubtasksCount}
					</dd>
				</div>
				<div className="grid grid-cols-2 py-px">
					<dt>All subtasks</dt>
					<dd>
						{deepSubtasks.count} / {deepSubtasks.completedCount}
					</dd>
				</div>
			</dl>
		</>
	);
}
