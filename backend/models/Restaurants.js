var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const { itemSchema } = require('./items');

const RestaurantSchema = new Schema({
  restId: {
    type: String
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  restName: {
    type: String
  },
  restAddress: {
    type: String
  },
  restZip: {
    type: String
  },
  restPhone: {
    type: String
  },
  restImage: {
    type: String,
    default: ""
  },
  restDesc: {
    type: String,
    default: ""
  },
  items: [itemSchema]
});

const Restaurants = mongoose.model('Restaurants', RestaurantSchema);
exports.Restaurants = Restaurants;
exports.RestaurantSchema = RestaurantSchema;
