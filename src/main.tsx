import { enableMapSet } from 'immer';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { App } from './ui/App';
import { router } from './ui/setup/router';
import { uiDependencies } from './ui/setup/ui-dependencies';

enableMapSet();

const rootElement = document.getElementById('root')!;
const root = ReactDOM.createRoot(rootElement);

root.render(
	<React.StrictMode>
		<App router={router} uiDependencies={uiDependencies} />
	</React.StrictMode>,
);
