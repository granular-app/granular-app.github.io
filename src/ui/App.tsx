import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export function App() {
	return (
		<>
			<Header />
			<Outlet />
		</>
	);
}
