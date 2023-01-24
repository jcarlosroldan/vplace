const K_RELEASED = -1, K_INACTIVE = 0, K_PRESSED = 1, K_ACTIVE = 2;
const KEY_LIFECYCLE = {[K_RELEASED]: K_INACTIVE, [K_INACTIVE]: K_INACTIVE, [K_PRESSED]: K_ACTIVE, [K_ACTIVE]: K_ACTIVE};
const KEYS = {'left': [37, 65], 'right': [39, 68], 'up': [38, 87], 'down': [40, 83], 'ctrl': [17], 'shift': [16], 'move': [77], 'brush': [66], 'fill': [70], 'eraser': [69], 'primary': [0], 'secondary': [2]};
const keys = {}; Object.keys(KEYS).forEach(k => keys[k] = 0);
function handleKey(value, ignore, mouse=false) {
	return e => {
		let key = mouse? e.button : e.keyCode;
		Object.entries(KEYS).forEach(([k, codes]) => {
			if (codes.includes(key)) {
				if (keys[k] != ignore) {
					//console.log(`${k}: ${keys[k]} -> ${value}`);
					keys[k] = value;
				}
				e.preventDefault();
			}
		})
	}
}
onkeydown = handleKey(K_PRESSED, K_ACTIVE);
onkeyup = handleKey(K_RELEASED, K_INACTIVE);
onmousedown = handleKey(K_PRESSED, K_ACTIVE, true);
onmouseup = handleKey(K_RELEASED, K_INACTIVE, true);
export const key = code => [K_PRESSED, K_ACTIVE].includes(keys[code]);
export const keyPressed = code => [K_PRESSED].includes(keys[code]);
export const keyReleased = code => [K_RELEASED].includes(keys[code]);
onblur = () => {
	Object.entries(keys).forEach(([k, v]) => {
		keys[k] = [K_PRESSED, K_ACTIVE].includes(v) ? K_RELEASED : v;
	})
};
export function clearKeys() {
	Object.entries(keys).forEach(([k, v]) => {
		keys[k] = KEY_LIFECYCLE[v];
	});
	wheelOffset = 0;
}
let mouse = [0, 0];  // x, y, key
function handleMouse(e, action=null) {
	mouse = [e.clientX, e.clientY];
}
function mouseInBox(x, y, width, height) {
	return mouse[0] >= x && mouse[0] < x + width && mouse[1] >= y && mouse[1] < y + height;
}
onmousemove = handleMouse;
let wheelOffset = 0;
const ZOOM_QUAD = 8 / 120000, ZOOM_LIN = (4 - ZOOM_QUAD * 40000) / 400;
addEventListener('wheel', e => {
	wheelOffset -= (ZOOM_QUAD * e.deltaY**2 + ZOOM_LIN * Math.abs(e.deltaY)) * Math.sign(e.deltaY) / 5;
	e.preventDefault();
}, {passive: false});