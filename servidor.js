const http = require('http'); // modulo http de node
const url = require('url'); // otro modulo de node. Para manejar urls
const queryString = require('querystring');
const usuariosJson = require('./usuarios.json');

const server = http.createServer((req, res) => {
	// dentro van las rutas que los usuarios consultarán
	// variable para saber a que url apunta el cliente
	let request = req.url;
	// para saber con que  metodo consulta el usuario
	let method = req.method;
	if (request == '/' && method == 'GET') {
		res.setHeader('Content-Type', 'text/plain; charset=utf-8');
		res.end('Página principal');
	} else if (request == '/usuarios' && method == 'GET') {
		// Mostrará contenido de tipo json, en este caso los usuarios
		res.setHeader('Content-Type', 'application/json; charset=utf-8');
		res.end(JSON.stringify(usuariosJson));
	} else if (request.startsWith('/usuarios') && method == 'GET') {
		res.setHeader('Content-Type', 'application/json; charset=utf-8');
		// rescatar url de donde quiero sacar query string
		let queryUrl = url.parse(req.url);
		let params = queryString.parse(queryUrl.query);
		let { nombre, apellido } = params;

		let filtroUsuarios = usuariosJson.usuarios.filter(
			(usuario) =>
				usuario.nombre.toLocaleLowerCase() == nombre.toLocaleLowerCase()
		);
		if (filtroUsuarios.length > 0) {
			res.end(JSON.stringify(filtroUsuarios));
		} else {
			res.statusCode = 404;
			let respuesta = {
				code: 404,
				message: 'Usuario no encontrado',
			};
			res.end(JSON.stringify(respuesta.message));
		}
	} else {
		res.setHeader('Content-Type', 'text/plain; charset=utf-8');
		res.statusCode = 404;
		res.end('Recurso no encontrado');
	}
});

const PORT = 3000;

server.listen(PORT, () => {
	console.log('servidor escuchando en http://localhost:' + PORT);
});
