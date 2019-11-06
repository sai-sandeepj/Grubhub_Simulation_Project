var assert = require("chai").assert;
var app = require("../index");

var chai = require("chai");
chai.use(require("chai-http"));
var expect = require("chai").expect;

var agent = require("chai").request.agent(app);

describe("Grubhub-app", function() {
  //LOGIN API
  describe("Login Positive Test", function() {
    it("correct Password", function() {
      agent
        .post("/api/login")
        .send({ email_id: "user1@domain.com", password: "user1@pwd" })
        .then(function(res) {
          expect(res.status).to.equal(200);
        })
        .catch(error => {
          console.log(error);
        });
    });
  });

  //Customer Sign Up API
  describe("Customer Signup Test", function() {
    it("Customer Signed Up", function() {
      agent
        .post("/api/signup/customer")
        .send({
          name: "customer_test4",
          email_id: "customertest4@domain.com",
          password: "customertest4@pwd",
          address: "San Jose",
          phone_number: "8885319425"
        })
        .then(function(res) {
          expect(res.status).to.equal(401);
        })
        .catch(error => {
          console.log(error);
        });
    });
  });

  //add section API -- negative
  describe("Add Section Test", function() {
    it("Section Already Exists", function() {
      agent
        .post("/api/sections/insert")
        .send({
          user_id: "12",
          menu_section_name: "Lunch"
        })
        .then(function(res) {
          expect(res.status).to.equal(500);
        })
        .catch(error => {
          console.log(error);
        });
    });
  });

  //search API
  describe("Search API Test", function() {
    it("Search Result fetched", function() {
      agent
        .get("/api/home/restaurantsearch/_")
        .then(function(res) {
          expect(res.status).to.equal(200);
        })
        .catch(error => {
          console.log(error);
        });
    });
  });

  //Add Item API
  describe("Add item test", function() {
    it("Item Already Exists", function() {
      agent
        .post("/api/items/insert")
        .send({
          user_id: "12",
          item_name: "Biryani",
          item_description: "its tasty biryani",
          item_price: "12",
          item_image: "password",
          menu_section_name: "Lunch"
        })
        .then(function(res) {
          expect(res.status).to.equal(500);
        })
        .catch(error => {
          console.log(error);
        });
    });
  });
});
