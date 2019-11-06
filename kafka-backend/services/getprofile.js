var express = require('express');
var app = express();
var { Users } = require('../models/Users');

async function handle_request(msg, callback) {
    console.log("Inside get profile in kafka backend");
    let response = {};
    let err = {};

    return await Users
        .findOne({
            userEmail: msg.userEmail
        })
        .select('-restaurant.items')
        .then((result) => {
            response.status = 200;
            response.message = "Succes" + result;
            response.data = result;
            return callback(null, response);
        })
        .catch((error) => {
            err.status = 400;
            err.message = "error in getting profile details";
            err.data = error;
            return callback(err, null);
        });
};

exports.handle_request = handle_request;