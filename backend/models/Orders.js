var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const { messageSchema } = require('./message');

const itemschemaTwo = new mongoose.Schema({

    itemId: {
        type: String
    },
    itemName: {
        type: String
    },
    itemQuantity: {
        type: Number
    },
    itemPrice: {
        type: Number
    },
    itemTotal: {
        type: Number
    }
});

const orderSchema = new mongoose.Schema({
    //orderId,
    customerEmail: {
        type: String
    },
    restId: {
        type: mongoose.Schema.Types.ObjectId
    },
    items: [itemschemaTwo],
    orderStatus: {
        type: String,
        enum: ["New", "Preparing", "Ready", "Delivered", "Cancelled"]
    },
    date: {
        type: Date
    },
    messages: [messageSchema]
});


const Orders = mongoose.model("Orders", orderSchema);
exports.Orders = Orders;
exports.orderSchema = orderSchema;
