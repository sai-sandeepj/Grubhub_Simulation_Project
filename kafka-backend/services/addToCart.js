var express = require('express');
const _ = require("lodash");
var app = express();
const bcrypt = require("bcrypt");
var { Users } = require('../models/Users');
var { Restaurants } = require('../models/Restaurants');

async function handle_request(msg, callback) {
    console.log("In add to cart in kafka backend");
    let response = {};
    let err = {};

    var PreviousRestId = "";
    var PreviousitemName = [];

    var getUserId = Users
        .findOne({ userEmail: msg.userEmail })
        .select('_id , cart')
        .then((result) => {
            if (result.cart.length != 0) {
                for (var i = 0; i < result.cart.length; i++) {

                    PreviousRestId = result.cart[i].restId;
                    PreviousitemName.push(result.cart[i].itemName);
                }
            }
            if ((result.cart.length === 0)) {
                var itemcart = {
                    userEmail: msg.userEmail,
                    itemId: msg.itemId,
                    restId: msg.restId,
                    itemName: msg.itemName,
                    itemPrice: msg.itemPrice,
                    itemQuantity: msg.itemQuantity,
                    itemTotal: msg.itemTotal
                };

                Users.findByIdAndUpdate(
                    result._id,
                    { $push: { "cart": itemcart } },
                    { new: true },
                    function (err, model) {
                        if (model) {
                            response.status = 200;
                            response.message = "Item added to cart";
                            return callback(null, response);
                        } else {
                            err.status = 410;
                            err.message = "Issue with adding item to cart";
                            err.data = error;
                            return callback(err, null);
                        }
                    }
                );
            } else if ((PreviousRestId.toString() === msg.restId)) {
                var itemcart = {
                    userEmail: msg.userEmail,
                    itemId: msg.itemId,
                    restId: msg.restId,
                    itemName: msg.itemName,
                    itemPrice: msg.itemPrice,
                    itemQuantity: msg.itemQuantity,
                    itemTotal: msg.itemTotal
                };

                Users.findByIdAndUpdate(
                    result._id,
                    { $push: { "cart": itemcart } },
                    { new: true },
                    function (err, model) {
                        if (model) {
                            response.status = 200;
                            response.message = "Item added to cart";
                            return callback(null, response);
                        } else {
                            err.status = 410;
                            err.message = "Issue with updating item to cart";
                            err.data = error;
                            return callback(err, null);
                        }
                    }
                );
            } else {
                err.status = 410;
                err.message = "Cannot add more than one restaurant";
                err.data = error;
                return callback(err, null);
            }
        }).catch(error => {
            err.status = 412;
            err.message = "Cannot find user";
            err.data = error;
            return callback(err, null);
        });
}
exports.handle_request = handle_request;