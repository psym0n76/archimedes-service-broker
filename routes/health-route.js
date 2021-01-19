const express = require('express');
const router = express.Router();
const Health = require('../models/health')

//middleware - can run a function from a GET request
//router.use('/',()=>{
//    console.log('this is middleware running - like functions')
//});

//routes
router.get('/', (req, res)=>{

        const health = {
            appName:'archimedes-service-broker',
            status:'live',
            statusMessage: 'ok',
            lastUpdated: Date.now()};

    res.send(health);
}) ;

//exports the router as middleware
module.exports = router;