var express = require('express');
const _ = require("lodash");
var app = express();
const bcrypt = require("bcrypt");
var { Users } = require('../models/Users');
var { Restaurants } = require('../models/Restaurants');

async function handle_request(msg, callback) {
    console.log("In add to cart");
    let response = {};
    let err = {};

    return Users
        .find({ userEmail: msg.userEmail })
        .select(['cart', '-_id'])
        .then((result) => {
            response.status = 200;
            response.message = "Succes" + result;
            response.data = JSON.stringify(result[0].cart);
            return callback(null, response);
        })
        .catch((error) => {
            err.status = 410;
            err.message = "Error in getting cart";
            err.data = error;
            return callback(err, null);
        });

}
exports.handle_request = handle_request;