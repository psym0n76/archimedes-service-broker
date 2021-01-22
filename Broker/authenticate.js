module.exports = {
	auth(){
		authenticate(token)
	}
	}

var authenticate = (token) => {
	socket = io(config.trading_api_proto + '://' + config.trading_api_host + ':' + config.trading_api_port, {
			query: querystring.stringify({
				access_token: token
			})
		});
	// fired when socket.io connects with no errors
	socket.on('connect', () => {
		console.log('Socket.IO session has been opened: ', socket.id);
		global.bearerToken = 'Bearer ' + socket.id + token;
		global.socket = socket;
	});

	// fired when socket.io cannot connect (network errors)
	socket.on('connect_error', (error) => {
		console.log('Socket.IO session connect error: ', error);
	});

	// fired when socket.io cannot connect (login errors)
	socket.on('error', (error) => {
		console.log('Socket.IO session error: ', error);
	});

	// fired when socket.io disconnects from the server
	socket.on('disconnect', () => {
		console.log('Socket disconnected, terminating client.');
		process.exit(-1);
	});
}


var config;
try {
	config = require('./config.js');
} catch (e) {
	console.log('Error loading config.js. Please rename or copy config.sample.js into config.js');
	process.exit();
}

var io = require('D:/GitHub/source/repos/FXCMAPI/RestAPI/fxcm-api-rest-nodejs-example/node_modules/socket.io/node_modules/socket.io-client');
var socket;

//allows you to parse URL query strings
var querystring = require('querystring');

//get properties from config.js
var token = config.token;