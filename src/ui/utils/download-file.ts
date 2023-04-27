export function downloadFile(filename: string, file: Blob) {
	const linkElement = document.createElement('a');
	linkElement.download = filename;
	linkElement.href = window.URL.createObjectURL(file);
	document.body.appendChild(linkElement);
	linkElement.click();
	document.body.removeChild(linkElement);
}
