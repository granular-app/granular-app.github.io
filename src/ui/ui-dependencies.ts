import { Signal } from '@preact/signals-react';
import { Maybe } from 'purify-ts';
import { createContext, useContext } from 'react';
import { ViewMainBoardController } from '../main-board/controllers/view-main-board-controller';
import { MainBoardUIModel } from '../main-board/presenters/main-board-presenter';
import { ViewTaskController } from '../task/controllers/view-task-controller';
import { ViewedTaskUIModel } from '../task/presenters/viewed-task-presenter';

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
