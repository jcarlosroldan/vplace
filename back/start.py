from asyncio import run, Future
from json import dumps, loads
from os.path import exists
from random import choice
from ssl import SSLContext, PROTOCOL_TLS_SERVER
from string import ascii_letters, digits
from websockets import serve

PATH_STATE = 'state.json'
ST = {}

async def main():
	if exists(PATH_STATE):
		with open(PATH_STATE, 'r', encoding='utf-8') as file:
			ST.update(loads(file.read()))
	else:
		ST.update({'users': []})
	ssl_context = SSLContext(PROTOCOL_TLS_SERVER)
	ssl_context.load_cert_chain('fullchain.pem', 'privkey.pem')
	async with serve(connection, '0.0.0.0', 8765, ssl=ssl_context):
		await Future()

async def connection(websocket):
	async def send(action, **data):
		print('>', action, data)
		await websocket.send('%s %s' % (action, dumps(data, ensure_ascii=False, separators=(',', ':'))))
	id = None
	while True:
		msg = await websocket.recv()
		action, *data = msg.split(' ', 1)
		data = loads(data[0]) if data else {}
		print('<', action, data)
		if action == 'auth':
			if 'id' in data and data['id'] < len(ST['users']) and 'password' in data and data['password'] == ST['users'][data['id']]['password']:
				id = data['id']
				await send('auth', success=True)
			else:
				password = randstr()
				id = len(ST['users'])
				ST['users'].append({'password': password, 'x': 0, 'y': 0})
				await send('auth', id=id, password=password)
			continue
		user = ST['users'][id]
		if action == 'pos':
			await send('pos', x=user['x'], y=user['y'])
		elif action == 'move':
			if 'x' in data and 'y' in data:
				user['x'] = data['x']
				user['y'] = data['y']

def randstr(length=32):
	return ''.join(choice(ascii_letters + digits) for _ in range(length))

if __name__ == '__main__':
	run(main())