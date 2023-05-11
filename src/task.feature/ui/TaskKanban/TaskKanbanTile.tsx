import { SparklesIcon } from '@heroicons/react/24/solid';
import { useSignal } from '@preact/signals-react';
import classNames from 'classnames';
import { ElementType, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ProgressBar } from 'src/ui/ProgressBar';
import { Draggable } from 'src/utils/ui/Draggable';
import { AppRoute } from '../../../ui/setup/router';
import { KanbanTaskUIModel } from '../../ui-models/kanban-task';
import { TaskForm } from '../TaskForm';
import { TaskKanbanTileActionsButton } from './TaskKanbanTileActionsButton';

export function TaskKanbanTile(props: {
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
			disabled={props.task.maybeDeepSubtasks.isJust()}
		>
			<TaskKanbanTileContents enableEditMode={enableEditMode} {...props} />
			{props.task.maybeDeepSubtasks
				.map((deepSubtasks) => (
					<ProgressBar
						progress={deepSubtasks.progress}
						className="-mt-0.5 h-0.5 rounded-b"
					/>
				))
				.extract()}
		</Draggable>
	);
}
function TaskKanbanTileContents(props: {
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
				{props.task.maybeDeepSubtasks.isJust() && (
					<SparklesIcon className="icon float-right ml-2 mt-1 text-gray-600" />
				)}
				<span>{props.task.text}</span>
			</Link>
			<TaskKanbanTileActionsButton
				enableEditMode={props.enableEditMode}
				deleteTask={() => props.deleteTask(props.task.id)}
			/>
		</div>
	);
}
