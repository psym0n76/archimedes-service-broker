
//https://www.youtube.com/watch?v=vjf774RKrLc
require('dotenv/config');

async function Runner(){

    const express = require('express')
    const app = express();
    const MaxRetry = 3;

    var conn = require('./Broker/authenticate.js');
    conn.auth();

    var retry = 1;
    while(typeof(global.bearerToken) === 'undefined' && retry < MaxRetry)
    {
        console.log('Waiting for connection... ' + retry + ' from ' + MaxRetry)
        await new Promise(resolve => setTimeout(resolve, 2000));
        retry++;
    }
    
    if(typeof(global.bearerToken) === 'undefined' && retry == MaxRetry)
    {
        console.log('Failed to connect with Max Retries'+ MaxRetry )
        process.exit();
    }

    console.log('Connected...' + global.bearerToken)
    

    // const brokerSubscriberRoute = require('./routes/broker-subscriber-route')
    // app.use('/api/broker-subscriber', brokerSubscriberRoute)

    // const brokerRoute = require('./routes/broker-route')
    // app.use('/api/broker', brokerRoute)

    console.log('Setup Endpoints')
    const healthRoute = require('./routes/health-route')
    app.use('/api/health', healthRoute)

    app.listen(process.env.PORT, ()=> console.log(`Listening to port ${process.env.PORT}`));


    console.log('Setup Rabbit Subscribers')
    const subscriber = require('./rabbit/subscriber.js');

    var price_callback = require('./rabbit/response-price.js')
    subscriber.subscriber('PriceRequestQueue', price_callback);

    var candle_callback = require('./rabbit/response-candle.js')
    subscriber.subscriber('CandleRequestQueue', candle_callback);

}

Runner();