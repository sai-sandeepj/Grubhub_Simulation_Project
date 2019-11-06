var express = require('express');
const _ = require("lodash");
var app = express();
var { Users } = require('../models/Users');
var { Restaurants } = require('../models/Restaurants');
var { Orders } = require('../models/Orders');

async function handle_request(msg, callback) {
    console.log("In set messages in kafka backend");
    let response = {};
    let err = {};
    return await Orders
        .findOne({ _id: msg.orderId })
        .select()
        .then(async (result) => {
            console.log("message set", result);
            console.log("messages ", result.messages);

            var isOwnerCheck;
            return await Users
                .findOne({ userEmail: msg.userEmail })
                .select('accountType')
                .then((result) => {

                    console.log("result type", result)
                    if (result.accountType === 1) {
                        isOwnerCheck = false;
                    } else {
                        isOwnerCheck = true;
                    }

                    var messageOne = {
                        message: msg.message,
                        isOwner: isOwnerCheck,
                        time: Date.now()
                    };

                    Orders.findByIdAndUpdate(
                        msg.orderId,
                        { $push: { messages: messageOne } },
                        { new: true },
                        function (err, model) {
                            if (model) {
                                console.log("message added", model);
                                response.status = 200;
                                response.message = "Message added", model;
                                response.data = model;
                                return callback(null, response);
                            } else {
                                console.log(err);
                                err.status = 410;
                                err.message = "couldn't add message", err;
                                return callback(err, null);
                            }
                        }
                    );
                })
                .catch((error) => {
                    console.log("could not get user", error);
                    err.status = 410;
                    err.message = "could not get user";
                    err.data = error;
                    return callback(err, null);
                });
        })
        .catch((error) => {
            console.log("could not set message", error);
            err.status = 411;
            err.message = "could not set message";
            err.data = error;
            return callback(err, null);
        });

}
exports.handle_request = handle_request;