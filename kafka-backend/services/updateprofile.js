var express = require('express');
const _ = require("lodash");
var app = express();
const bcrypt = require("bcrypt");
var { Users } = require('../models/Users');
var { Restaurants } = require('../models/Restaurants');

async function handle_request(msg, callback) {
    console.log("In update profile");
    let response = {};
    let err = {};

    var userAccount = Users
        .findOne({ userEmail: msg.userEmail })
        .select('accountType')
        .then(async (userAccount) => {
            if (userAccount === 1) {
                var userUpdate = Users
                    .update({ userEmail: msg.userEmail },
                        {
                            $set: {
                                userName: msg.userName,
                                userEmail: msg.userEmail,
                                // userPassword: msg.userPassword,
                                userPhone: msg.userPhone,
                                userAddress: msg.userAddress,
                                userZip: msg.userZip,
                                userImage: msg.userImage
                            }
                        }).then((update) => {
                            console.log("customer profile updated");
                            response.status = 200;
                            response.message = "Customer Profile Updated";
                            return callback(null, response);
                        }).catch((error) => {
                            console.log(err);
                            err.status = 411;
                            err.message = "error in updating customer profile";
                            err.data = error;
                            return callback(err, null);
                            //return res.status(412).end(JSON.stringify(err));
                        });
            }
            else {
                var userUpdate = Users
                    .update({ userEmail: msg.userEmail },
                        {
                            $set: {
                                userName: msg.userName,
                                userEmail: msg.userEmail,
                                // userPassword: msg.userPassword,
                                userPhone: msg.userPhone,
                                userAddress: msg.userAddress,
                                userZip: msg.userZip,
                                userImage: msg.userImage,

                                "restaurant.restName": msg.restName,
                                "restaurant.restAddress": msg.restAddress,
                                "restaurant.restZip": msg.restZip,
                                "restaurant.restPhone": msg.restPhone,
                                "restaurant.restImage": msg.restImage,
                                "restaurant.restDesc": msg.restDesc
                            }
                        }).then((update) => {
                            console.log("owner profile updated");
                            response.status = 200;
                            response.message = "Owner Profile Updated";
                            return callback(null, response);
                        }).catch((error) => {
                            console.log(err);
                            err.status = 412;
                            err.message = "error in updating owner profile";
                            err.data = error;
                            return callback(err, null);
                            //return res.status(412).end(JSON.stringify(err));
                        });
            }

        });
};
exports.handle_request = handle_request;