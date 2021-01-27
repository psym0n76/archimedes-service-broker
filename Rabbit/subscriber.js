//https://www.cloudamqp.com/blog/2020-09-21-how-to-run-rabbitmq-with-nodejs.html

module.exports = {subscriber(queue, callback){
    subscribe(queue, callback)}}

const amqplib = require('amqplib');

async function subscribe(queue, callback) {

    if(typeof(callback)==='undefined')
	callback = default_callback;

    var conn = await amqplib.connect(process.env.RABBITMQ_HOST + ':' + parseInt(process.env.RABBITMQ_PORT), "heartbeat=60");
    var ch = await conn.createChannel()
    await conn.createChannel();
    await ch.assertQueue(queue, {durable: true, autoDelete:true});

    console.log('Subscribed to ' + queue);
    await ch.consume(queue, function (msg) {

        callback(queue, msg);

        ch.ack(msg);
        }, {consumerTag: 'myconsumer'});
}

var default_callback = (queue, data) => {
    console.log('From default queue ' + queue + ' ' + data.content.toString());
}