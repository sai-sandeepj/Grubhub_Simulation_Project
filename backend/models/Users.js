const mongoose = require("mongoose");
//const { restaurantSchema } = require("./restaurantModel");
const { RestaurantSchema } = require('./Restaurants');
const { itemSchema } = require('./items');
const { cartSchema } = require('./Cart');

//Schema
const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true
    },
    userEmail: {
      type: String,
      required: true,
      unique: true
    },
    userPassword: {
      type: String,
      required: true
    },
    userPhone: {
      type: String,
      required: true
    },
    userAddress: {
      type: String,
      default: ""
    },
    userZip: {
      type: String,
      default: ""
    },
    userImage: {
      type: String,
      default: ""
    },
    accountType: {
      type: Number,
      required: true,
      enum: [1, 2]
    },
    restaurant: RestaurantSchema,
    cart: [cartSchema]
  }
);

//Model
const Users = mongoose.model("Users", userSchema);
exports.Users = Users;
exports.userSchema = userSchema;

