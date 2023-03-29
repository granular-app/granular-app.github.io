import { useSignal } from '@preact/signals-react';
import { Breadcrumbs } from './Breadcrumbs';
import { useCurrentTask } from './hooks/use-current-task';
import { TaskActions } from './TaskActions';
import { EditTaskForm } from './TaskForm';

export function TaskHeader() {
	const currentTask = useCurrentTask();

	return (
		<header className="rounded bg-white p-4 pt-6 shadow-sm">
			<Breadcrumbs />
			<div className="flex items-start">
				<TaskHeading />
				<TaskActions task={currentTask} />
			</div>
		</header>
	);
}

function TaskHeading() {
	const currentTask = useCurrentTask();
	const editModeEnabled = useSignal(false);

	if (editModeEnabled.value) {
		return (
			<div className="mr-auto">
				<EditTaskForm
					task={currentTask}
					onCloseForm={() => (editModeEnabled.value = false)}
				/>
			</div>
		);
	}

	return (
		<h1 className="flex-grow text-2xl">
			<span>{currentTask.text}</span>
			{!currentTask.isRoot && (
				<button
					className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded border text-zinc-500 hover:border-zinc-900 hover:text-zinc-900"
					onClick={() => (editModeEnabled.value = true)}
				>
					<i className="ri-pencil-line text-base"></i>
				</button>
			)}
		</h1>
	);
}
