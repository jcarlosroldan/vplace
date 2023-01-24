import {socket} from './script/socket.js';
import {key, clearKeys} from './script/input.js';
import {FPS} from './script/utils.js';

function init() {
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');
	document.body.appendChild(canvas);
	onresize = () => {
		canvas.width = innerWidth;
		canvas.height = innerHeight;
	}
	onresize();
	loop(ctx);
}

function loop(ctx) {
	const start = Date.now();
	ctx.fillStyle = 'black';
	// draw circle in the middle of the screen
	ctx.beginPath();
	ctx.arc(innerWidth / 2, innerHeight / 2, 20, 0, 2 * Math.PI);
	ctx.fill();
	
	clearKeys();
	setTimeout(() => loop(ctx), Math.max(0, 1000 / FPS - (Date.now() - start)));
}

onload = init;