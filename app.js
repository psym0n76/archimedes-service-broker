const express = require('express')
const app = express();
require('dotenv/config');


const healthRoute = require('./routes/health-route')

app.use('/api/health', healthRoute)

//https://www.youtube.com/watch?v=vjf774RKrLc


//https://stackoverflow.com/questions/10547974/how-to-install-node-js-as-windows-service
//npm install -g qckwinsvc

//how do we start listenign
app.listen(process.env.PORT, ()=>console.log(`Listening to port ${process.env.PORT}`));