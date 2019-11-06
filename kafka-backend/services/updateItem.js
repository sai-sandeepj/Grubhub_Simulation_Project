var express = require('express');
const _ = require("lodash");
var app = express();
const bcrypt = require("bcrypt");
var { Users } = require('../models/Users');
var { Restaurants } = require('../models/Restaurants');

async function handle_request(msg, callback) {
    console.log("In update Item");
    let response = {};
    let err = {};
    return await Users
        .find({ userEmail: msg.userEmail })
        .select()
        .then(async (result) => {
            console.log("result", result);
            console.log(result[0]._id);

            var itemlength = (result[0].restaurant.items).length;
            console.log("itemlength", itemlength);

            var updates = [];
            result[0].restaurant.items.forEach(async (item) => {
                var updatePromise = await Users.update({ '_id': result[0]._id, 'restaurant.items._id': msg.itemId },
                    {
                        $set: {
                            'restaurant.items.$.itemName': msg.itemName,
                            'restaurant.items.$.itemDesc': msg.itemDesc,
                            'restaurant.items.$.itemImage': msg.itemImage,
                            'restaurant.items.$.itemType': msg.itemType,
                            'restaurant.items.$.itemPrice': msg.itemPrice
                        }
                    })
            });

            Promise.all(updates).then(function (results) {
                response.status = 200;
                response.message = "Item updated";
                return callback(null, response);
            }).catch(error => {
                err.status = 411;
                err.message = "Item not updated";
                err.data = error;
                return callback(err, null);
            })
        })
        .catch((error) => {
            err.status = 412;
            err.message = "Cannot get Owner";
            err.data = error;
            return callback(err, null);
        });
}
exports.handle_request = handle_request;