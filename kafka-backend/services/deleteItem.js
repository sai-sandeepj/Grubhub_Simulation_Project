var express = require('express');
const _ = require("lodash");
var app = express();
const bcrypt = require("bcrypt");
var { Users } = require('../models/Users');
var { Restaurants } = require('../models/Restaurants');

async function handle_request(msg, callback) {
    console.log("In delete item in kafka backend");
    let response = {};
    let err = {};
    return await Users
        .findOne({ userEmail: msg.userEmail })
        .select('_id')
        .then(async (result) => {
            console.log("result", result._id);

            return await Users
                .update(
                    { _id: result._id },
                    { '$pull': { 'restaurant.items': { '_id': msg.itemId } } },
                    { safe: true, upsert: true },
                    function (err, obj) {
                        if (obj) {
                            response.status = 200;
                            response.message = "Item deleted";
                            return callback(null, response);
                        } else {
                            err.status = 410;
                            err.message = "error in deleting item";
                            err.data = error;
                            return callback(err, null);
                        }
                    }
                );
        })
        .catch((error) => {
            err.status = 411;
            err.message = "couldn't get user";
            err.data = error;
            return callback(err, null);
        });
}
exports.handle_request = handle_request;