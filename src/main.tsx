import { enableMapSet } from 'immer';
import React from 'react';
import ReactDOM from 'react-dom/client';
import 'remixicon/fonts/remixicon.css';
import { App } from './App';
import './index.css';
import { localization } from './localization/ui-localization/localization';
import { getTask } from './setup/get-task';
import { taskContext } from './setup/task-context';
import { taskControllerFactory } from './setup/task-controller-factory';
import { taskRouter } from './setup/task-router';
import { initTaskLocalStorage } from './task/storage/storage';

enableMapSet();
localization.init();
initTaskLocalStorage(taskContext);

const rootElement = document.getElementById('root')!;
const root = ReactDOM.createRoot(rootElement);

root.render(
	<React.StrictMode>
		<App
			taskRouter={taskRouter}
			getTask={getTask}
			taskControllerFactory={taskControllerFactory}
		/>
	</React.StrictMode>,
);
