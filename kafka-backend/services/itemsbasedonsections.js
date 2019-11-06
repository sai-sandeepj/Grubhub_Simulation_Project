var express = require('express');
const _ = require("lodash");
var app = express();
const bcrypt = require("bcrypt");
var { Users } = require('../models/Users');
var { Restaurants } = require('../models/Restaurants');

async function handle_request(msg, callback) {
    console.log("In items based on sections in kafka backend");
    let response = {};
    let err = {};

    return await Users
        .findOne({ userEmail: msg.userEmail })
        .select()
        .then((result) => {
            if (!result) {
                console.log("couldn't get itemsbasedonsections");
                err.status = 410;
                err.message = "couldn't get itemsbasedonsections";
                err.data = error;
                return callback(err, null);
            } else {
                console.log("result" + result);
                console.log("result1" + result.restaurant._id);
                return Users
                    .find({ "restaurant._id": result.restaurant._id, "restaurant.items": { $elemMatch: { itemType: msg.itemType } } })
                    .select('restaurant.items')
                    .then((result) => {
                        console.log(result);
                        if (!result) {
                            console.log("couldn't get itemsbasedonsections");
                            err.status = 411;
                            err.message = "couldn't get itemsbasedonsections";
                            err.data = error;
                            return callback(err, null);
                        } else {
                            console.log("itemsbasedonsections retreived");
                            console.log("result" + result.filter);
                            response.status = 200;
                            response.message = "Succes";
                            response.data = JSON.stringify(result);
                            return callback(null, response);
                        }
                    }).catch(error => {
                        err.status = 412;
                        err.message = "couldn't get itemsbasedonsections";
                        err.data = error;
                        return callback(err, null);
                    });
            }
        })
        .catch((error) => {
            console.log("couldnt get itemsbasedonsections details", err);
            err.status = 413;
            err.message = "couldn't get itemsbasedonsections details";
            err.data = error;
            return callback(err, null);
        });
}
exports.handle_request = handle_request;