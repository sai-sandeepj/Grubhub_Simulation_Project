var express = require('express');
var app = express();
var { Users } = require('../models/Users');

async function handle_request(msg, callback) {
    console.log("Inside received reply in kafka backend");
    let response = {};
    let err = {};
    var val = msg.itemName;

    return await Users
        .find({
            'restaurant.items': { $elemMatch: { itemName: new RegExp(val, 'i') } }
        })
        .select(['restaurant', '-_id'])
        .then((result) => {
            response.status = 200;
            response.message = "Succes" + result;
            response.data = result;
            return callback(null, response);
        })
        .catch((error) => {
            err.status = 400;
            err.message = "error in getting restaurants by itemname";
            err.data = error;
            return callback(err, null);
        });
};

exports.handle_request = handle_request;