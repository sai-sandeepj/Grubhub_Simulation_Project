var express = require('express');
const _ = require("lodash");
var app = express();
const bcrypt = require("bcrypt");
var { Users } = require('../models/Users');
var { Restaurants } = require('../models/Restaurants');

async function handle_request(msg, callback) {
    console.log("In all sections in kafka backend");
    let response = {};
    let err = {};

    return await Users
        .findOne({ userEmail: msg.userEmail })
        .select('-restaurant.items.itemType')
        .then(async (result) => {
            if (!result) {
                err.status = 411;
                err.message = "couldn't get section details";
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

                            var sectionlength = (result.restaurant.items).length;
                            var sections = [];

                            result.restaurant.items.forEach(async (section) => {
                                sections.push(section.itemType);
                            });

                            response.status = 200;
                            response.message = "Reterived all sections";
                            response.data = JSON.stringify(Array.from(new Set(sections)));
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
            err.message = "error in getting section";
            err.data = error;
            return callback(err, null);
        });
};
exports.handle_request = handle_request;