var express = require('express');
const _ = require("lodash");
var app = express();
const bcrypt = require("bcrypt");
var { Users } = require('../models/Users');
var { Restaurants } = require('../models/Restaurants');

async function handle_request(msg, callback) {
    console.log("In delete section in kafka backend");
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
                    { '$pull': { 'restaurant.items': { 'itemType': msg.itemType } } },
                    { safe: true, upsert: true },
                    function (err, obj) {
                        if (obj) {
                            response.status = 200;
                            response.message = "Section Deleted";
                            return callback(null, response);

                        } else {
                            err.status = 410;
                            err.message = "Section not found";
                            err.data = error;
                            return callback(err, null);
                        }
                    }
                );
        })
        .catch((err) => {
            err.status = 400;
            err.message = "error in deleting section";
            err.data = error;
            return callback(err, null);
        });
}

exports.handle_request = handle_request;