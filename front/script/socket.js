import adapter from 'webrtc-adapter';
import {storage} from './utils.js';

console.debug(`[webrtc-adapter] browser is ${adapter.browserDetails.browser}`);

export const socket = new WebSocket('wss://juancroldan.com:8765');

socket.onopen = () => {
	send('auth', storage('id') === null ? {} : {id: storage('id'), password: storage('password')});
}
socket.onclose = () => console.debug('WebSocket disconnected');
socket.onerror = error => console.error(error);
socket.onmessage = event => {
	const separator = event.data.indexOf(' ');
	receive(event.data.slice(0, separator), JSON.parse(event.data.slice(separator + 1)));
};

function send(action, data={}) {
	console.debug('[ws] >', action, data);
	socket.send(`${action} ${JSON.stringify(data)}`);
}

function receive(action, data={}) {
	console.debug('[ws] <', action, data);
	if (action === 'auth') {
		if (data.id !== undefined && data.password !== undefined) {
			storage('id', data.id);
			storage('password', data.password);
		} else if (data.success === undefined) {
			send('register');
		}
	}
}