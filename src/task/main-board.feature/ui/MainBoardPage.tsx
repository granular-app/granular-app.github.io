import { SparklesIcon } from '@heroicons/react/24/solid';
import { TaskKanban } from 'src/task/ui/TaskKanban';
import { Sidebar } from 'src/ui/Sidebar';
import { useUIDependencies } from 'src/ui/ui-dependencies';
import { useMainBoard } from './use-main-board-state';

export function MainBoardPage() {
	const mainBoard = useMainBoard();
	const { addMainBoardTaskController } = useUIDependencies();

	return (
		<>
			<MainBoardSidebar />
			<TaskKanban
				columns={mainBoard.tasks}
				addSubtask={addMainBoardTaskController.run}
			/>
		</>
	);
}

function MainBoardSidebar() {
	const mainBoard = useMainBoard();

	return (
		<Sidebar>
			<h1 className="text-lg">Main Board</h1>
			<h3 className="mt-5 mb-1 text-sm font-bold text-gray-500">Status</h3>
			<div className="flex items-center justify-between">
				<span className="font-bold text-gray-700">{mainBoard.status}</span>
				<SparklesIcon className="icon ml-2" />
			</div>
			<div className="mb-2 h-1 w-full bg-gray-200">
				<div
					className="h-full bg-gray-400"
					style={{ width: `${mainBoard.progress * 100}%` }}
				>
					<div className="h-full w-full bg-repeat heropattern-diagonalstripes-gray-500"></div>
				</div>
			</div>
			<dl className="divide-y divide-gray-100 text-sm text-gray-600">
				<div className="grid grid-cols-2 py-px">
					<dt>Main Board tasks</dt>
					<dd>
						{mainBoard.mainBoardCompletedTasksCount} /{' '}
						{mainBoard.mainBoardTasksCount}
					</dd>
				</div>
				<div className="grid grid-cols-2 py-px">
					<dt>All tasks</dt>
					<dd>
						{mainBoard.allCompletedTasksCount} / {mainBoard.allTasksCount}
					</dd>
				</div>
			</dl>
		</Sidebar>
	);
}
