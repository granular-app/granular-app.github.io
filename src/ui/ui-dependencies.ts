import { Signal } from '@preact/signals-react';
import { Maybe } from 'purify-ts';
import { createContext, useContext } from 'react';
import { MainBoardUIModel } from 'src/task/main-board.feature/main-board.presenter';
import { ViewMainBoardController } from 'src/task/main-board.feature/view-main-board.controller';
import { ViewTaskController } from 'src/task/view-task.feature/view-task.controller';
import { ViewedTaskUIModel } from 'src/task/view-task/viewed-task.presenter';

const UIDependenciesContext = createContext<UIDependencies | null>(null);

export function useUIDependencies() {
	const uiDependencies = useContext(UIDependenciesContext);

	if (uiDependencies === null) {
		throw new Error(
			`This app's UI requires global UI states to be provided, but they weren't.`,
		);
	} else {
		return uiDependencies;
	}
}

export type UIDependencies = {
	mainBoardState: Signal<Maybe<MainBoardUIModel>>;
	viewMainBoardController: ViewMainBoardController;
	viewedTaskState: Signal<Maybe<ViewedTaskUIModel>>;
	viewTaskController: ViewTaskController;
};

export const UIDependenciesProvider = UIDependenciesContext.Provider;
