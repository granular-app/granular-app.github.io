import { enableMapSet } from 'immer';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './index.css';
import { router } from './ui/router';

enableMapSet();

const rootElement = document.getElementById('root')!;
const root = ReactDOM.createRoot(rootElement);

root.render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>,
);
