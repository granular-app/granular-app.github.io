import { RouterProvider } from 'react-router-dom';
import { Adapters, AdaptersProvider } from './adapaters';

type Router = Parameters<typeof RouterProvider>[0]['router'];

export function App(props: { router: Router; adapters: Adapters }) {
	return (
		<AdaptersProvider value={props.adapters}>
			<RouterProvider router={props.router} />
		</AdaptersProvider>
	);
}
