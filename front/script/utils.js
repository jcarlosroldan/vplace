export const FPS = 60;
export const state = {};

export function storage(key, value=undefined) {
	if (value === undefined) {
		return JSON.parse(localStorage.getItem(key));
	} else if (value === null) {
		localStorage.removeItem(key);
	} else {
		localStorage.setItem(key, JSON.stringify(value));
	}
}