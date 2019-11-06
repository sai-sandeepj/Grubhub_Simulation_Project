const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const config = require("../config");
const { Users } = require("../models/Users");


async function handle_request(msg, callback) {
    console.log("Inside login in kafka backend");
    let response = {};
    let err = {};

    try {
        let user = await Users.findOne({
            userEmail: msg.userEmail
        });

        if (!user) {
            err.status = 400;
            err.message = "Invalid Email or Password";
            return callback(err, null);
            //return res.status(400).send("Invalid Email or Password");
        } else {
            console.log(user);

            const validPassword = await bcrypt.compare(msg.userPassword, user.userPassword);
            if (!validPassword) {
                err.status = 400;
                err.message = "Invalid Email or Password";
                return callback(err, null);
                // return res.status(400).send("Invalid Email or Password");
            } else {
                let payload = _.pick(user, ["_id", "userName", "userEmail", "accountType"]);

                console.log(payload);
                var token = jwt.sign(payload, config.secret, {
                    expiresIn: 900000 // in seconds
                });

                response.status = 200;
                response.data = token;
                return callback(null, response);
            }
        }
    } catch (error) {
        err.status = 500;
        err.message = "Internal Server Error";
        return callback(err, null);
    }
}
//s;
exports.handle_request = handle_request;