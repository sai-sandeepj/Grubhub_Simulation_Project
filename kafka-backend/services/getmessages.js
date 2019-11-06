var express = require('express');
const _ = require("lodash");
var app = express();
var { Users } = require('../models/Users');
var { Restaurants } = require('../models/Restaurants');
var { Orders } = require('../models/Orders');

async function handle_request(msg, callback) {
    console.log("In get messages in kafka backend");
    let response = {};
    let err = {};

    return await Orders
        .find({ _id: msg.orderId })
        .select('messages')
        .then((result) => {
            console.log("got message", result);
            response.status = 200;
            response.message = "got message";
            response.data = JSON.stringify(result);
            return callback(null, response);
        })
        .catch((error) => {
            console.log(error);
            err.status = 410;
            err.message = "Error in getting message";
            err.data = JSON.stringify(err);
            return callback(err, null);
        })
}
exports.handle_request = handle_request;