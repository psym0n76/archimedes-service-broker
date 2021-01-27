const express = require('express');
const router = express.Router();


//middleware - can run a function from a GET request
//router.use('/',()=>{
//    console.log('this is middleware running - like functions')
//});


//routes
//example route http://localhost:3000/api/broker-subscriber/price/market/GBP%2FUSD/
router.get('/price/market/:marketName', (req, res)=>{

//read response
res.send(req.params)

var params = {
    'resource': '/subscribe',
    'method': 'POST',
    'params': { 'pairs':req.params.marketName }
};

var querystring = require('querystring');
params.params = querystring.stringify(params.params)

var request = require('../Broker/request-live-price');

//add custom callback to post update to queue
request.subscriber(params);
    res.send("Live Price Request");
}) ;

//exports the router as middleware
module.exports = router;