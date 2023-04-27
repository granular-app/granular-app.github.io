const maxPageNameLength = 100 as const;

export function setDocumentTitle(pageName: string) {
	document.title = `${truncateString(pageName, maxPageNameLength)} | Granular`;
}

function truncateString(s: string, maxLength: number) {
	if (s.length > maxLength) {
		return s.slice(0, maxLength) + '...';
	} else {
		return s;
	}
}
