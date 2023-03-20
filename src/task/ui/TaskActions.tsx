import * as FloatingUI from '@floating-ui/react';
import classNames from 'classnames';
import React, { useState } from 'react';
import { FloatingWindow } from '../../ui/FloatingWindow';
import { TaskStatus, taskStatuses } from '../entity/status';
import { Task } from '../entity/task';
import { deleteTask } from '../ui-controller/deleteTask';

export function TaskActions({ task }: { task: Task }) {
	if (task.isRoot) return <></>;

	return (
		<div className="ml-3 inline-flex space-x-2">
			<StatusPicker task={task} />
			<DeleteTaskButton task={task} />
		</div>
	);
}

function StatusPicker({ task }: { task: Task }) {
	const [selectIsVisible, setSelectIsVisible] = useState(false);
	const selectData = FloatingUI.useFloating({
		placement: 'bottom-end',
		middleware: [FloatingUI.offset(5), FloatingUI.shift()],
	});
	const refs = selectData.refs;

	return (
		<div>
			<StatusPickerButton
				ref={refs.setReference}
				task={task}
				onClick={toggleSelect}
			/>
			<FloatingWindow
				isVisible={selectIsVisible}
				setIsVisible={setSelectIsVisible}
			>
				<StatusPickerSelect
					ref={refs.setFloating}
					task={task}
					selectData={selectData}
				/>
			</FloatingWindow>
		</div>
	);

	function toggleSelect() {
		setSelectIsVisible((value) => !value);
	}
}

const StatusPickerButton = React.forwardRef<
	HTMLButtonElement,
	{ task: Task; onClick?: React.MouseEventHandler<HTMLButtonElement> }
>(({ task, onClick }, ref) => {
	return (
		<button
			ref={ref}
			onClick={onClick}
			className="flex rounded bg-zinc-200 py-0.5 px-1.5"
		>
			<span>{task.status}</span>
			<i className="ri-arrow-down-s-line"></i>
		</button>
	);
});

const StatusPickerSelect = React.forwardRef<
	HTMLDivElement,
	{
		task: Task;
		selectData: ReturnType<typeof FloatingUI.useFloating>;
	}
>(({ task, selectData }, ref) => {
	const dynamicStyles = {
		position: selectData.strategy,
		top: selectData.y ?? 0,
		left: selectData.x ?? 0,
	};

	const setStatusButtonListIsVisible = !task.usesDynamicStatus;
	const setStatusButtonList = (
		<ul>
			{taskStatuses.map((status) => (
				<li key={status}>
					<SetStatusButton task={task} newStatus={status} />
				</li>
			))}
		</ul>
	);

	return (
		<FloatingUI.FloatingFocusManager context={selectData.context}>
			<div
				ref={ref}
				style={dynamicStyles}
				className="w-max rounded bg-white p-4 shadow"
			>
				{setStatusButtonListIsVisible && setStatusButtonList}
				{setStatusButtonListIsVisible && <hr />}
				<StatusModeToggle task={task} />
			</div>
		</FloatingUI.FloatingFocusManager>
	);
});

function SetStatusButton({
	task,
	newStatus,
}: {
	task: Task;
	newStatus: TaskStatus;
}) {
	return (
		<button
			onClick={() => (task.base.staticStatus = newStatus)}
			className={classNames('text-xs text-zinc-500', {
				'font-bold': task.status === newStatus,
			})}
			disabled={task.status === newStatus}
		>
			{newStatus}
		</button>
	);
}

function StatusModeToggle({ task }: { task: Task }) {
	const nextStatusMode = task.usesDynamicStatus ? 'static' : 'dynamic';
	const label = `Use ${nextStatusMode} status`;

	return (
		<button
			onClick={() => task.base.togglePrefersStaticStatus()}
			className="text-xs text-zinc-500"
		>
			{label}
		</button>
	);
}

function DeleteTaskButton({ task }: { task: Task }) {
	return (
		<button
			onClick={() => deleteTask(task.base.id)}
			className="ml-2 text-xs text-red-500"
		>
			<i className="ri-delete-bin-line"></i>
		</button>
	);
}
