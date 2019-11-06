const express = require("express");
const router = express.Router();
var kafka = require("../kafka/client");

//Passport authentication
var passport = require('passport');
var jwt = require('jsonwebtoken');
var requireAuth = passport.authenticate('jwt', { session: false });

router.post("/customerSignup", (req, res) => {
  console.log("Inside customer signup Post Request");
  console.log("Req Body : ", req.body);

  kafka.make_request("customerSignup_topic", req.body, function (err, results) {
    console.log("In make request call back");
    console.log(results);
    console.log(err);
    if (err) {
      console.log("Inside err");
      console.log(err);
      return res.status(err.status).send(err.message);
    } else {
      console.log("Inside else");
      console.log(results);
      return res.status(results.status).send(results.message);
    }
  });
});

module.exports = router;
