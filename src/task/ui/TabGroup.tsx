import { signal } from '@preact/signals-react';
import classNames from 'classnames';
import { useMemo } from 'react';
import { AddParentsView } from './AddParentsView';
import { useCurrentTask } from './hooks/use-current-task';
import { TaskKanban } from './TaskKanban';
import { TaskParentListView } from './TaskParentListView';

export function TabGroup() {
	const currentTask = useCurrentTask();
	const tabs = [
		{ name: 'Child tasks', view: () => <TaskKanban /> },
		...(!currentTask.isRoot
			? [
					{
						name: 'Parent tasks',
						view: () => (
							<div className="p-3">
								<TaskParentListView />
								<AddParentsView />
							</div>
						),
					},
			  ]
			: []),
	] as const;
	const tabIndex = useMemo(() => signal(0), [currentTask.id]);

	return (
		<div>
			<ul className="mt-2 mb-1 flex space-x-1 pl-3">
				{tabs.map((tab, i) => (
					<li key={i}>
						<button
							onClick={() => (tabIndex.value = i)}
							className={classNames('rounded py-1 px-2', {
								'bg-white shadow-sm': i === tabIndex.value,
							})}
						>
							{tab.name}
						</button>
					</li>
				))}
			</ul>
			<div className="rounded bg-white shadow-sm">
				{tabs[tabIndex.value].view()}
			</div>
		</div>
	);
}
