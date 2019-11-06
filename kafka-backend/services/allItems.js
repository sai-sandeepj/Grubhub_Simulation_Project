var express = require('express');
const _ = require("lodash");
var app = express();
const bcrypt = require("bcrypt");
var { Users } = require('../models/Users');
var { Restaurants } = require('../models/Restaurants');

async function handle_request(msg, callback) {
    console.log("In all items in kafka backend");
    let response = {};
    let err = {};

    return await Users
        .findOne({ userEmail: msg.userEmail })
        .select()
        .then(async (result) => {
            if (!result) {
                err.status = 411;
                err.message = "couldn't get user details";
                err.data = error;
                return callback(err, null);
            } else {
                return Users
                    .findOne({ "restaurant._id": result.restaurant._id })
                    .select()
                    .then(async (result) => {
                        if (!result) {
                            err.status = 412;
                            err.message = "couldn't get restaurant details";
                            err.data = error;
                            return callback(err, null);
                        } else {
                            response.status = 200;
                            response.message = "Reterived all items";
                            response.data = JSON.stringify(result.restaurant.items);
                            return callback(null, response);
                        }
                    }).catch((error) => {
                        err.status = 413;
                        err.message = "error in getting restaurant details";
                        err.data = error;
                        return callback(err, null);
                    });
            }
        }).catch((error) => {
            err.status = 400;
            err.message = "error in getting restaurant id";
            err.data = error;
            return callback(err, null);
        });
};
exports.handle_request = handle_request;