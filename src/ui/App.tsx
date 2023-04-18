import { RouterProvider } from 'react-router-dom';
import { UIDependencies, UIDependenciesProvider } from './ui-dependencies';

type Router = Parameters<typeof RouterProvider>[0]['router'];

export function App(props: { router: Router; uiDependencies: UIDependencies }) {
	return (
		<UIDependenciesProvider value={props.uiDependencies}>
			<RouterProvider router={props.router} />
		</UIDependenciesProvider>
	);
}
