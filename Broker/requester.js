module.exports = {
requestCandle(params, callback, candleMessage){
    request_processor(params, callback, candleMessage)
}
}

var request_processor = (params, callback, candleMessage) => {
	var requestID = getNextRequestID();

	if(typeof(callback)==='undefined')
	callback = default_callback;
	console.log('request #', requestID, ' sending');

	if (params.method === "GET") {
		params.resource += '/?' + params.request;
    }

    var tradinghttp = require('https')
	var req = tradinghttp.request({
			host:  config.trading_api_host,
			port:  config.trading_api_port,
			path: params.resource,
			method: params.method,
			headers: request_headers
		}, (response) => {
			var data = '';
			response.on('data', (chunk) => data += chunk); // re-assemble fragmented response data
			response.on('end', () => {
				callback(response.statusCode, candleMessage, data);
			});
		}).on('error', (err) => {
			callback(0, params, err); // this is called when network request fails
		});


	// non-GET HTTP(S) reuqests pass arguments as data
	if (params.method !== "GET" && typeof(params.params) !== 'undefined') {
		req.write(params.params);
	}
	req.end();
};

var default_callback = (statusCode, requestID, data) => {
	if (statusCode === 200) {
		try {
			var jsonData = JSON.parse(data);
		} catch (e) {
			console.log('request #', requestID, ' JSON parse error:', e);
			return;
		}
		console.log('DEFAULT CALLBACK request #', requestID, ' has been executed:', JSON.stringify(jsonData, null, 2));

		var candles = [];
			jsonData.candles.forEach(element => {

				var fields = element.toString().split(',');

				var candle = {
					'timeStamp' : fields[0],
					'bidOpen':fields[1],
					'bidClose':fields[2],
					'bidHigh':fields[3],
					'bidLow':fields[4],
					'askOpen':fields[5],
					'askClose':fields[6],
					'askHigh':fields[7],
					'askLow':fields[8],
					'tickQty' :fields[9]
				}
				candles.push(candle)
			});

		var candleMessage = {
			"instrumentId" : jsonData.instrument_id,
			"periodId": jsonData.periodId,
			"candle" : candles
		}

		console.log(candleMessage)

	} else {
		console.log('request #', requestID, ' execution error:', statusCode, ' : ', data);
	}
}


var request_headers = {
	'User-Agent': 'request',
	'Accept': 'application/json',
	'Content-Type': 'application/x-www-form-urlencoded',
	'Authorization': global.bearerToken
}

var globalRequestID = 1;
var getNextRequestID = () => {
	return globalRequestID++;
}

var config;
try {
	config = require('./config.js');
} catch (e) {
	console.log('Error loading config.js. Please rename or copy config.sample.js into config.js');
	process.exit();
}