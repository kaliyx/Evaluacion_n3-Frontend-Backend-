import '@testing-library/jest-dom';

// Polyfill for window.matchMedia used by antd's responsiveObserver
if (typeof window !== 'undefined' && !('matchMedia' in window)) {
	// Minimal mock implementation
	// See: https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia
	// The mock returns an object with the methods antd expects.
	// Tests can override this behavior if they need to simulate matches.
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	window.matchMedia = (query: string) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: () => {},
		removeListener: () => {},
		addEventListener: () => {},
		removeEventListener: () => {},
		dispatchEvent: () => false,
	});
}

// Polyfill for window.getComputedStyle used by some antd utilities in jsdom
if (typeof window !== 'undefined' && !('getComputedStyle' in window)) {
	// @ts-ignore
	window.getComputedStyle = (elt: Element) => ({
		getPropertyValue: () => '',
	});
}
