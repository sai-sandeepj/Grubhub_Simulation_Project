var express = require('express');
const _ = require("lodash");
var app = express();
const bcrypt = require("bcrypt");
var { Users } = require('../models/Users');
var { Restaurants } = require('../models/Restaurants');
var { Orders } = require('../models/Orders');

async function handle_request(msg, callback) {
    console.log("In all orders in kafka backend");
    let response = {};
    let err = {};

    return await Users
        .findOne({ userEmail: msg.userEmail })
        .select(['restaurant._id', '-_id'])
        .then(async (result) => {
            console.log("result", result);
            console.log("last", result.restaurant._id);

            return await Orders
                .find({ restId: result.restaurant._id })
                .select()
                .then(async (result1) => {
                    console.log("result1", result1)
                    if (result1.length === 0) {
                        err.status = 412;
                        err.message = "No orders found!";
                        err.data = error;
                        return callback(err, null);
                    }
                    else {
                        console.log("result1", result1);
                        console.log(result1[0].customerEmail);

                        return await Users
                            .findOne({ userEmail: result1[0].customerEmail })
                            .select(['userAddress', 'userName', 'userImage', '-_id'])
                            .then((result2) => {
                                console.log("result2", result2);
                                var result3;

                                result3 = JSON.stringify(result2) + JSON.stringify(result1[0]);
                                result3 = result3.replace(/\}\{/, ",");
                                result3 = JSON.parse(result3);
                                console.log("result3", result3);

                                response.status = 200;
                                response.message = "Success";
                                response.data = JSON.stringify(result3);
                                return callback(null, response);
                            })
                            .catch((error) => {
                                err.status = 410;
                                err.message = "error in getting customer";
                                err.data = error;
                                return callback(err, null);
                            })
                    }
                })
                .catch((error) => {
                    err.status = 410;
                    err.message = "error in getting user";
                    err.data = error;
                    return callback(err, null);
                });
        })
        .catch((error) => {
            err.status = 410;
            err.message = "No active orders";
            err.data = error;
            return callback(err, null);
        });
}
exports.handle_request = handle_request;