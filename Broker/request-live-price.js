module.exports = {
        subscriber(params){
            subscribe(params);
        }
}

var subscribe = (params) => {
	var callback = (statusCode, requestID, data) => {
		if (statusCode === 200) {
			try {
				var jsonData = JSON.parse(data);
			} catch (e) {
				console.log('subscribe request #', requestID, ' JSON parse error: ', e);
				return;
			}
			if(jsonData.response.executed) {
				try {
					for(var i in jsonData.pairs) {
						// need to refernce the socket opened
						global.socket.on(jsonData.pairs[i].Symbol, priceUpdate);
					}
				} catch (e) {
					console.log('subscribe request #', requestID, ' "pairs" JSON parse error: ', e);
					return;
				}
			} else {
				console.log('subscribe request #', requestID, ' not executed: ', jsonData);
			}
		} else {
			console.log('subscribe request #', requestID, ' execution error: ', statusCode, ' : ', data);
		}
    }

	var req = require('./requester');
	
	console.log(params);

	req.requestCandle(params, callback);
}

var priceUpdate = (update) => {
	try {
		var jsonData = JSON.parse(update);
		// JavaScript floating point arithmetic is not accurate, so we need to round rates to 5 digits
		// Be aware that .toFixed returns a String
		jsonData.Rates = jsonData.Rates.map(function(element){
			return element.toFixed(5);
		});
		console.log(`@${jsonData.Updated} Price update of [${jsonData.Symbol}]: ${jsonData.Rates}`);
	} catch (e) {
		console.log('price update JSON parse error: ', e);
		return;
	}
}