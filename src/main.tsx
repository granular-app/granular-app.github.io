import { enableMapSet } from 'immer';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { App } from './ui/App';
import { adapters } from './ui/setup/adapters';
import { router } from './ui/setup/router';

enableMapSet();

const rootElement = document.getElementById('root')!;
const root = ReactDOM.createRoot(rootElement);

root.render(
	<React.StrictMode>
		<App router={router} adapters={adapters} />
	</React.StrictMode>,
);
