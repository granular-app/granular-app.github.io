import { enableMapSet } from 'immer';
import React from 'react';
import ReactDOM from 'react-dom/client';
import 'remixicon/fonts/remixicon.css';
import { App } from './App';
import './index.css';
import { localization } from './localization/ui-localization/localization';
import { getTask } from './setup/get-task';
import { taskControllerFactory } from './setup/task-controller-factory';
import { taskRouter } from './setup/task-router';

enableMapSet();
localization.init();

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
