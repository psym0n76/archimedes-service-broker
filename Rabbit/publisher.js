//https://www.cloudamqp.com/blog/2020-09-21-how-to-run-rabbitmq-with-nodejs.html

module.exports = {publisher(message, params){
    produce(message, params)}}

const amqplib = require('../node_modules/amqplib');

async function produce(message, params){

    console.log("Publishing " + params.exchange);

    var conn = await amqplib.connect(process.env.RABBITMQ_HOST + ':' + parseInt(process.env.RABBITMQ_PORT), "heartbeat=60");
    var ch = await conn.createChannel()
    var exch = params.exchange;
    var rkey = '';

    await ch.assertExchange(exch, params.type, {durable: false}).catch(console.error);
    //await ch.assertQueue(params.queue, {durable: false});
    //await ch.bindQueue(params.queue, exch, rkey);
    await ch.publish(exch, rkey, Buffer.from(JSON.stringify(message)));

    setTimeout( function()  {
        ch.close();
        conn.close();},  500 );
}