var connection = new require("./kafka/Connection");
const mongoose = require("mongoose");
const config = require("./config");

//topics files
var customerSignup = require("./services/customerSignup");
var ownerSignup = require("./services/ownerSignup");
var restaurantsbyItemName = require("./services/restaurantsbyItemName");
var restaurantsbyItemCuisine = require("./services/restaurantsbyItemCuisine");
var login = require("./services/login");
var getprofile = require("./services/getprofile");
var updateprofile = require("./services/updateprofile");
var itemsByRestaurant = require("./services/itemsByRestaurant");
var additem = require("./services/additem");
var allItems = require("./services/allItems");
var allsections = require("./services/allsections");
var addToCart = require("./services/addToCart");
var deleteCartItem = require("./services/deleteCartItem");
var orderItems = require("./services/orderItems");
var upcomingOrders = require("./services/upcomingOrders");
var allorders = require("./services/allorders");
var showcart = require("./services/showcart");
var deleteSection = require("./services/deleteSection");
var manageOrders = require("./services/manageOrders");
var updateSection = require("./services/updateSection");
var updateItem = require("./services/updateItem");
var deleteItem = require("./services/deleteItem");
var itemsbasedonsections = require("./services/itemsbasedonsections");
var previousOrders = require("./services/previousOrders");
var getmessages = require("./services/getmessages");
var setmessages = require("./services/setmessages");


//Mongo Connection
const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoURI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true
    });
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.log("Could not connect to MongoDB", err);
  }
};

connectDB();

//Handle topic request
function handleTopicRequest(topic_name, fname) {
  //var topic_name = 'root_topic';
  var consumer = connection.getConsumer(topic_name);
  var producer = connection.getProducer();
  console.log("server is running ");
  consumer.on("message", function (message) {
    console.log("message received for " + topic_name + " ", fname);
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);

    fname.handle_request(data.data, function (err, res) {
      console.log("after handle" + res);
      var payloads = [
        {
          topic: data.replyTo,
          messages: JSON.stringify({
            correlationId: data.correlationId,
            data: res,
            err: err
          }),
          partition: 0
        }
      ];
      producer.send(payloads, function (err, data) {
        if (err) {
          console.log("error when producer sending data", err);
        } else {
          console.log("producer send", data);
        }
      });
      return;
    });
  });
}

// Add your TOPICs here
//first argument is topic name
//second argument is a function that will handle this topic request
handleTopicRequest("customerSignup_topic", customerSignup);
handleTopicRequest("restaurantsbyItemName_topic", restaurantsbyItemName);
handleTopicRequest("restaurantsbyItemCuisine_topic", restaurantsbyItemCuisine);
handleTopicRequest("login_topic", login);
handleTopicRequest("ownerSignup_topic", ownerSignup);
handleTopicRequest("getprofile_topic", getprofile);
handleTopicRequest("updateprofile_topic", updateprofile);
handleTopicRequest("itemsByRestaurant_topic", itemsByRestaurant);
handleTopicRequest("additem_topic", additem);
handleTopicRequest("allItems_topic", allItems);
handleTopicRequest("allsections_topic", allsections);
handleTopicRequest("addToCart_topic", addToCart);
handleTopicRequest("deleteCartItem_topic", deleteCartItem);
handleTopicRequest("orderItems_topic", orderItems);
handleTopicRequest("upcomingOrders_topic", upcomingOrders);
handleTopicRequest("allorders_topic", allorders);
handleTopicRequest("showcart_topic", showcart);
handleTopicRequest("deleteSection_topic", deleteSection);
handleTopicRequest("manageOrders_topic", manageOrders);
handleTopicRequest("updateSection_topic", updateSection);
handleTopicRequest("updateItem_topic", updateItem);
handleTopicRequest("deleteItem_topic", deleteItem);
handleTopicRequest("itemsbasedonsections_topic", itemsbasedonsections);
handleTopicRequest("previousOrders_topic", previousOrders);
handleTopicRequest("getmessages_topic", getmessages);
handleTopicRequest("setmessages_topic", setmessages);

