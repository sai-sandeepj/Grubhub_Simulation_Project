var express = require('express');
const _ = require("lodash");
var app = express();
const bcrypt = require("bcryptjs");
var { Users } = require('../models/Users');

async function handle_request(msg, callback) {

  console.log("Inside customer signup in kafka backend");
  let response = {};
  let err = {};

  if (msg.accountType != 1) {
    console.log("enter accountype as 1");

    err.status = 410;
    err.message = "enter accountype as 1";
    return callback(err, null);

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

    new_user.save(function (error) {
      if (error) {
        if (error.errmsg.indexOf("duplicate key error")) {
          console.log("Try with other email Id", error);
          err.status = 411;
          err.message = "Try with other email Id";
          err.data = error;
          return callback(err, null);
        } else {
          console.log("Unable to save user details", err);
          err.status = 412;
          err.message = "Unable to save user details";
          err.data = error;
          return callback(err, null);
        }
      }
      console.log("User saved successfully");
      response.status = 200;
      response.message = "Customer Signup Success";
      return callback(null, response);
    });

  }

};


exports.handle_request = handle_request;