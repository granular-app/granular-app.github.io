import { Switch } from '@headlessui/react';
import classNames from 'classnames';
import { TaskUIModel } from '../ui-model/task';
import { useTaskController } from './hooks/use-task-controller';

export function DynamicStatusToggle({ task }: { task: TaskUIModel }) {
	const taskController = useTaskController(task.id);

	return (
		<Switch
			checked={task.usesDynamicStatus}
			onChange={(prefersDynamicStatus) =>
				prefersDynamicStatus
					? taskController.setPrefersDynamicStatus()
					: taskController.setPrefersStaticStatus()
			}
		>
			<DynamicStatusIcon active={task.usesDynamicStatus} />
		</Switch>
	);
}

export function DynamicStatusIcon({ active }: { active: boolean }) {
	return (
		<i
			className={classNames(
				'ri-flashlight-fill flex h-4 w-4 items-center rounded-full p-0.5 text-center text-xs',
				active ? 'bg-cyan-200 text-cyan-600' : 'bg-zinc-200 text-zinc-600',
			)}
		/>
	);
}
