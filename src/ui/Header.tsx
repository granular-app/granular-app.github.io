import { Link } from 'react-router-dom';
import { useAdapters } from './adapaters';
import { AppRoute } from './setup/router';
import { useFileUpload } from './utils/use-file-upload';

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
						<ExportDataButton />
					</li>
					<li>
						<ImportDataButton />
					</li>
				</ul>
			</nav>
		</header>
	);
}

function ExportDataButton() {
	const { exportDataController } = useAdapters();

	return <button onClick={exportDataController.run}>Export</button>;
}

function ImportDataButton() {
	const { importDataController } = useAdapters();
	const { invisibleFileInput, triggerFileUpload } = useFileUpload(
		importDataController.run,
	);

	return (
		<div>
			{invisibleFileInput}
			<button onClick={triggerFileUpload}>Import</button>
		</div>
	);
}
