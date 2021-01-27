const express = require('express');
const router = express.Router();


//middleware - can run a function from a GET request
//router.use('/',()=>{
//    console.log('this is middleware running - like functions')
//});

//routes
// sample route http://localhost:3000/api/broker/candle/market/4/granularity/m15/datefrom/1611579600/dateto/1611583200/count/4
router.get('/candle/market/:marketId/granularity/:granularityId/dateFrom/:dateFromId/dateTo/:dateToId/count/:counter', (req, res)=>{

res.send(req.params);

var params = {
    'resource': '/candles/'+ req.params.marketId + '/' + req.params.granularityId,
    'method': 'GET',
    'request': 'num=' + req.params.counter + '&from=' + req.params.dateFromId + '&to=' + req.params.dateToId,
};

console.log(params);

var request = require('../Broker/requester');

//add custom callback to post update to queue
request.requestCandle(params, rabbit_callback)
    //res.send("Candle Request");
}) ;

//exports the router as middleware




module.exports = router;