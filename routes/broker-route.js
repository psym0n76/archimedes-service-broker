const express = require('express');
const router = express.Router();


//middleware - can run a function from a GET request
//router.use('/',()=>{
//    console.log('this is middleware running - like functions')
//});

//routes
router.get('/', (req, res)=>{

//read response
// tranlate into rrequest

var params = {
    'resource': '/candles/1/m1',
    'method': 'GET',
    'request': 'num=1&from=1519084679&to=1519430400'
};

var params = {
    'resource': '/candles/1/m1',
    'method': 'GET',
    'request': 'num=1'
};

var request = require('../Broker/requester');

//add custom callback to post update to queue
request.requestCandle(params)

    res.send("Candle Request");
}) ;

//exports the router as middleware
module.exports = router;