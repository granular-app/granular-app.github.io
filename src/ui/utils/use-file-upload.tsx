import { ChangeEvent, useCallback, useRef } from 'react';

export function useFileUpload(onUpload: (contents: string) => void) {
	const handleFileChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			const file = event.target.files![0];
			if (!file) return;

			const reader = new FileReader();

			reader.onload = function (event) {
				const contents = event.target?.result as string;

				if (contents) {
					onUpload(contents);
				}
			};

			reader.onerror = function () {
				console.error('Error reading file');
				reader.abort();
			};

			reader.readAsText(file);
		},
		[],
	);

	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const invisibleFileInput = (
		<input
			type="file"
			className="hidden"
			ref={fileInputRef}
			onChange={handleFileChange}
		/>
	);

	const triggerFileUpload = useCallback(() => {
		fileInputRef.current!.click();
	}, []);

	return { invisibleFileInput, triggerFileUpload };
}
