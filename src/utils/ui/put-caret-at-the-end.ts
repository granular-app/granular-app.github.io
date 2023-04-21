export function putCaretAtTheEnd(elem: {
	setSelectionRange: (start: number, end: number) => void;
	value: {
		length: number;
	};
}) {
	elem.setSelectionRange(elem.value.length, elem.value.length);
}
