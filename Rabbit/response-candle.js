
var candle_callback = (queue, data) => {

    var candleMessage = JSON.parse(data.content);

    console.log('Received from ' + queue);
    console.log(candleMessage);

    var moment = require('moment'); // require
    var startDate = moment(candleMessage.StartDate).unix();
    var endDate = moment(candleMessage.EndDate).unix();

    // build a candle request
    var params = {
        'resource': '/candles/'+ candleMessage.ExternalMarketId + '/' + candleMessage.TimeFrameBroker,
        'method': 'GET',
        'request': 'num=' + candleMessage.Intervals + '&from=' + startDate + '&to=' + endDate,
    };

    console.log('Request parameters:');
    console.log(params);

    var request = require('../Broker/requester');
    request.requestCandle(params, rabbit_callback, candleMessage)
}

var rabbit_callback = (statusCode, params, data) => {
	if (statusCode === 200) {
		try {
            var jsonData = JSON.parse(data);
            
		} catch (e) {
			console.log('request #', requestID, ' JSON parse error:', e);
			return;
        }
        
        
        var moment = require('moment'); // require

		var candles = [];
			jsonData.candles.forEach(element => {
                var fields = element.toString().split(',');
                
				var candle = {
                    'market' : params.Market,
                    'marketId': params.MarketId,
                    'granularity': params.Interval + params.TimeFrame,
                    'fromDate': new Date(parseInt(fields[0]) * 1000),
                    'toDate': moment(parseInt(fields[0])*1000).add(params.Interval,'m').toDate(),
					'timeStamp' : new Date(parseInt(fields[0]) * 1000),
					'bidOpen': fields[1],
					'bidClose': fields[2],
					'bidHigh': fields[3],
					'bidLow': fields[4],
					'askOpen': fields[5],
					'askClose': fields[6],
					'askHigh': fields[7],
					'askLow': fields[8],
                    'tickQty' : fields[9],
                    'lastUpdated' : new Date()
				}
				candles.push(candle)
			});

		var candleMessage = {
            'marketId': params.MarketId,
            'startDate': params.StartDate,
            'endDate' : params.EndDate,
			'market' : params.Market,
            'granularity':  params.Interval + params.TimeFrame,
            'timeFrame' : params.TimeFrame,
            'interval' : params.Interval,
			'candles' : candles
        }
        
		var rabbitParams = {
			"queue":"",
			"exchange" : "Archimedes_Candle",
			"type" : "fanout"
		}

		const rabbit = require('../Rabbit/publisher.js')
		rabbit.publisher(candleMessage, rabbitParams);

	} else {
		console.log('request #', requestID, ' execution error:', statusCode, ' : ', data);
	}
}



module.exports = candle_callback;