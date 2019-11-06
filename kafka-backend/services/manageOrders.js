var express = require('express');
const _ = require("lodash");
var app = express();
const bcrypt = require("bcrypt");
var { Users } = require('../models/Users');
var { Restaurants } = require('../models/Restaurants');
var { Orders } = require('../models/Orders');

async function handle_request(msg, callback) {
    console.log("In manage orders");
    let response = {};
    let err = {};

    return await Orders
        .update({ _id: msg.orderId },
            {
                $set: {
                    orderStatus: msg.orderStatus
                }
            })
        .then((update) => {
            response.status = 200;
            response.message = "Orders Managed";
            response.data = update;
            return callback(null, response);
        })
        .catch((error) => {
            err.status = 410;
            err.message = "Error in manage orders";
            err.data = error;
            return callback(err, null);
        });

}
exports.handle_request = handle_request;