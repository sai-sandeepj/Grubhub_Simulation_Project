var express = require('express');
const _ = require("lodash");
var app = express();
const bcrypt = require("bcrypt");
var { Users } = require('../models/Users');
var { Restaurants } = require('../models/Restaurants');
var { Orders } = require('../models/Orders');


async function handle_request(msg, callback) {
    console.log("In previous orders");
    let response = {};
    let err = {};

    return await Orders
        .find({ customerEmail: msg.userEmail, orderStatus: { $in: ["Delivered", "Cancelled"] } })
        .select()
        .then((result) => {
            console.log("result" + result);
            response.status = 200;
            response.message = "Success";
            response.data = JSON.stringify(result);
            return callback(null, response);
        })
        .catch((error) => {
            err.status = 410;
            err.message = "couldn't fetch previous orders";
            err.data = JSON.stringify(err);
            return callback(err, null);
        })
}
exports.handle_request = handle_request;