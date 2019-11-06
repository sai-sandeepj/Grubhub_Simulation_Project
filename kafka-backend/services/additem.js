var express = require('express');
const _ = require("lodash");
var app = express();
const bcrypt = require("bcrypt");
var { Users } = require('../models/Users');
var { Restaurants } = require('../models/Restaurants');

async function handle_request(msg, callback) {
    console.log("In add item in kafka backend");
    let response = {};
    let err = {};

    var getrestId = Users
        .find({ userEmail: msg.userEmail })
        .select()
        .then(async (getrestId) => {
            var item = {
                restId: getrestId[0].restaurant._id,
                cuisineName: msg.cuisineName,
                itemName: msg.itemName,
                itemType: msg.itemType,
                itemPrice: msg.itemPrice,
                itemImage: msg.itemImage,
                itemDesc: msg.itemDesc
            };

            Users.findByIdAndUpdate(
                getrestId[0]._id,
                { $push: { "restaurant.items": item } },
                { new: true },
                function (err, model) {
                    if (model) {
                        response.status = 200;
                        response.message = "Item added Success";
                        return callback(null, response);
                    } else {
                        err.status = 411;
                        err.message = "Error in adding item";
                        err.data = error;
                        return callback(err, null);
                    }
                }
            );
        }).catch((error) => {
            err.status = 400;
            err.message = "error in getting restaurant id";
            err.data = error;
            return callback(err, null);
        });
};
exports.handle_request = handle_request;