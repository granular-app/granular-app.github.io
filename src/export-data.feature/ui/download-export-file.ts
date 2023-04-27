import { downloadFile } from 'src/ui/utils/download-file';

const exportFileName = 'taskmap-export.json' as const;

export function downloadExportFile(file: Blob) {
	downloadFile(exportFileName, file);
}
