var express = require('express');
const _ = require("lodash");
var app = express();
const bcrypt = require("bcryptjs");
var { Users } = require('../models/Users');
var { Restaurants } = require('../models/Restaurants');

async function handle_request(msg, callback) {
    console.log("In owner signup");
    let response = {};
    let err = {};

    if (msg.accountType != 2) {
        console.log("enter accountype as 2");

        err.status = 410;
        err.message = "enter accountype as 2";
        return callback(err, null);
        //res.status(410).end("enter accountype as 2");
    } else {
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(msg.userPassword, salt);

        var new_user = new Users({
            userName: msg.userName,
            userEmail: msg.userEmail,
            userPassword: password,
            userPhone: msg.userPhone,
            userAddress: msg.userAddress,
            userZip: msg.userZip,
            accountType: msg.accountType
        });

        new_user.save().then((doc) => {
            console.log("getting userId");

            var new_userId = Users
                .findOne({ userEmail: msg.userEmail })
                .select('_id')
                .then(async (new_user_id) => {
                    if (!new_user_id) {
                        console.log("UserId not created");
                        err.status = 411;
                        err.message = "UserId not created";
                        err.data = error;
                        return callback(err, null);
                        //return res.status(412).end("UserId not created");
                    } else {
                        console.log("found new userId");
                        console.log("adding to restaurants");

                        var new_restaurant = new Restaurants({
                            "userId": new_user_id._id,
                            "restName": msg.restName,
                            "restAddress": msg.restAddress,
                            "restZip": msg.restZip,
                            "restPhone": msg.restPhone,
                            "restImage": msg.restImage,
                            "restDesc": msg.restDesc
                        });

                        var doc = await Users.findOne({ _id: new_user_id._id }).exec();
                        doc.restaurant = new_restaurant;
                        try {
                            await doc.save();
                            response.status = 200;
                            response.message = "Owner Signup Success";
                            return callback(null, response);
                        } catch (error) {
                            console.log("Owner Signup unsuccessful", err);
                            err.status = 411;
                            err.message = "Try with other email Id";
                            err.data = error;
                            return callback(err, null);
                        }
                    }
                })
                .catch((error) => {
                    console.log(err);
                    err.status = 412;
                    err.message = error;
                    err.data = error;
                    return callback(err, null);
                    //return res.status(412).end(JSON.stringify(err));
                });
        })
            .catch((error) => {
                if (error.errmsg.indexOf("duplicate key error") > 1) {
                    console.log("Try with other email Id", error);
                    err.status = 413;
                    err.message = "Try with other email Id";
                    err.data = error;
                    return callback(err, null);
                } else {
                    console.log("Unable to save user details", err);
                    err.status = 414;
                    err.message = "Unable to save user details";
                    err.data = error;
                    return callback(err, null);
                    //res.status(412).end("Unable to save user details");
                }
            });
    }
};
exports.handle_request = handle_request;