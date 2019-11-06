var express = require('express');
var app = express();
var { Users } = require('../models/Users');

async function handle_request(msg, callback) {
    console.log("Inside items by restaurant in kafka backend");
    let response = {};
    let err = {};

    return await Users
        .find({
            'restaurant.items': { $elemMatch: { restId: msg.restId } }
        })
        .select(['restaurant', '-_id'])
        .then((result) => {
            response.status = 200;
            response.message = "Succes";
            response.data = result[0].restaurant;
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