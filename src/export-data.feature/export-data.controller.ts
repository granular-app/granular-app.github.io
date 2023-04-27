import { ExportDataUseCase } from './export-data.use-case';

export class ExportDataController {
	constructor(private exportDataUseCase: ExportDataUseCase) {}

	run = () => {
		this.exportDataUseCase.run();
	};
}
