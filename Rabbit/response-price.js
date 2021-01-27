var price_callback = (queue, data) => {
    console.log('From queue callback ' + queue + ' ' + data.content.toString());
}

module.exports = price_callback;