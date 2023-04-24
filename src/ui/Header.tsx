import { Link } from 'react-router-dom';
import { AppRoute } from './setup/router';

export function Header() {
	return (
		<header className="sticky top-0 z-10 flex h-10 w-full flex-shrink-0 items-center justify-between border-b px-6 backdrop-blur">
			<Link to="/" className="text-2xl text-gray-700">
				granular
			</Link>

			<nav className="text-sm font-semibold text-gray-700">
				<ul className="flex space-x-8">
					<li>
						<Link to={AppRoute.MainBoard}>Main Board</Link>
					</li>
					<li>
						<Link to={AppRoute.Settings}>Settings</Link>
					</li>
				</ul>
			</nav>
		</header>
	);
}
