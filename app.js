
//https://www.youtube.com/watch?v=vjf774RKrLc

async function Runner(){

    const express = require('express')
    const app = express();
    require('dotenv/config');
    
    var conn = require('./Broker/authenticate.js');
    conn.auth();
    
    while(typeof(global.bearerToken) === 'undefined')
    {
        console.log('waiting for connection')
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log('connected with ' + global.bearerToken)
    
    const brokerSubscriberRoute = require('./routes/broker-subscriber-route')
    app.use('/api/broker-subscriber', brokerSubscriberRoute)

    const brokerRoute = require('./routes/broker-route')
    app.use('/api/broker', brokerRoute)

    const healthRoute = require('./routes/health-route')
    app.use('/api/health', healthRoute)


    app.listen(process.env.PORT, ()=>console.log(`Listening to port ${process.env.PORT}`));

}

Runner();