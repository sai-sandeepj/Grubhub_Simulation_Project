var express = require('express');
const _ = require("lodash");
var app = express();
const bcrypt = require("bcrypt");
var { Users } = require('../models/Users');
var { Restaurants } = require('../models/Restaurants');
var { Orders } = require('../models/Orders');

async function handle_request(msg, callback) {
    console.log("In all sections");
    let response = {};
    let err = {};

    return await Users
        .findOne({ userEmail: msg.userEmail })
        .select()
        .then(async (result) => {
            console.log("order items", result);
            console.log("order items", (result.cart).length);

            var Ordersitems = [];
            for (var i = 0; i < (result.cart).length; i++) {
                var orderitem = {
                    itemId: result.cart[i].itemId,
                    itemName: result.cart[i].itemName,
                    itemQuantity: result.cart[i].itemQuantity,
                    itemPrice: result.cart[i].itemPrice,
                    itemTotal: result.cart[i].itemTotal
                };
                Ordersitems.push(orderitem);
            }

            var new_order = new Orders({
                customerEmail: msg.userEmail,
                restId: result.cart[0].restId,
                orderStatus: "New",
                date: Date().toString(),
                items: Ordersitems
            });

            new_order.save().then(async (doc) => {
                console.log("order saved");

                return await Users
                    .update(
                        { _id: result._id },
                        { '$set': { cart: [] } },
                        { safe: true, upsert: true, multi: true },
                        function (err, obj) {
                            if (obj) {
                                response.status = 200;
                                response.message = "Order Sucessfully Placed";
                                return callback(null, response);
                            } else {
                                err.status = 412;
                                err.message = "couldn't place order";
                                err.data = error;
                                return callback(err, null);
                            }
                        }
                    );
            })
                .catch((error) => {
                    err.status = 410;
                    err.message = "couldn't place order";
                    err.data = error;
                    return callback(err, null);
                });
        })
        .catch((error) => {
            err.status = 411;
            err.message = "couldn't place order";
            err.data = error;
            return callback(err, null);
        });
}
exports.handle_request = handle_request;