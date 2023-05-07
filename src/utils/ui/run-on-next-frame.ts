export function runOnNextFrame(callback: () => void) {
	setTimeout(function () {
		requestAnimationFrame(callback);
	});
}
