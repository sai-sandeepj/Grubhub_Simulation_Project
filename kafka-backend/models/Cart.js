var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const cartSchema = new mongoose.Schema({
  userEmail: {
    type: String,
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId
  },
  restId: {
    type: mongoose.Schema.Types.ObjectId
  },
  itemName: {
    type: String
  },
  itemImage: {
    type: String,
  },
  itemPrice: {
    type: Number
  },
  itemQuantity: {
    type: Number
  },
  itemTotal: {
    type: Number
  }
});

const Cart = mongoose.model('Cart', cartSchema);
exports.Cart = Cart;
exports.cartSchema = cartSchema;