import { Signal } from '@preact/signals-react';
import { Maybe } from 'purify-ts';
import { createContext, useContext } from 'react';
import { EditTaskController } from 'src/task/edit-task.feature/edit-task.controller';
import { AddMainBoardTaskController } from 'src/task/main-board.feature/add-main-board-task.controller';
import { MainBoardUIModel } from 'src/task/main-board.feature/main-board.presenter';
import { ViewMainBoardController } from 'src/task/main-board.feature/view-main-board.controller';
import { AddViewedTaskSubtaskController } from 'src/task/viewed-task.feature/add-subtask.controller';
import { EditViewedTaskController } from 'src/task/viewed-task.feature/edit-viewed-task.controller';
import { SetViewedTaskStaticStatusController } from 'src/task/viewed-task.feature/set-viewed-task-static-status.controller';
import { ViewTaskController } from 'src/task/viewed-task.feature/view-task.controller';
import { ViewedTaskUIModel } from 'src/task/viewed-task.feature/viewed-task.presenter';

const AdaptersContext = createContext<Adapters | null>(null);

export function useAdapters() {
	const adapters = useContext(AdaptersContext);

	if (adapters === null) {
		throw new Error(
			`The UI needs adapters to work, but they weren't provided.`,
		);
	} else {
		return adapters;
	}
}

export type Adapters = {
	mainBoardState: Signal<Maybe<MainBoardUIModel>>;
	viewMainBoardController: ViewMainBoardController;
	addMainBoardTaskController: AddMainBoardTaskController;
	editMainBoardTaskController: EditTaskController;
	viewedTaskState: Signal<Maybe<ViewedTaskUIModel>>;
	viewTaskController: ViewTaskController;
	addViewedTaskSubtaskController: AddViewedTaskSubtaskController;
	editViewedTaskSubtaskController: EditTaskController;
	editViewedTaskController: EditViewedTaskController;
	setViewedTaskStaticStatusController: SetViewedTaskStaticStatusController;
};

export const AdaptersProvider = AdaptersContext.Provider;