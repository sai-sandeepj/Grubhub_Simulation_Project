const app = require("./app");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const passport = require("passport");
require('./passport')(passport)
const jwt = require("jsonwebtoken");
const config = require("./config");
const cookieParser = require('cookie-parser')

const multer = require('multer');
const path = require('path');
const fs = require('fs');



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


//routes
const customerSignup = require("./routes/customerSignup");
const ownerSignup = require("./routes/ownerSignup");
const login = require("./routes/login");
const restaurantsbyItemName = require("./routes/restaurantsbyItemName");
const restaurantsbyItemCuisine = require("./routes/restaurantsbyItemCuisine");
const getProfile = require("./routes/getProfile");
const updateprofile = require("./routes/updateprofile");
const itemsByRestaurant = require("./routes/itemsByRestaurant");
const additem = require("./routes/additem");
const allItems = require("./routes/allItems");
const allsections = require("./routes/allsections");
const addToCart = require("./routes/addToCart");
const deleteCartItem = require("./routes/deleteCartItem");
const orderItems = require("./routes/orderItems");
const upcomingOrders = require("./routes/upcomingOrders");
const allorders = require("./routes/allorders");
const showcart = require("./routes/showcart");
const deleteSection = require("./routes/deleteSection");
const manageOrders = require("./routes/manageOrders");
const updateSection = require("./routes/updateSection");
const updateItem = require("./routes/updateItem");
const deleteItem = require("./routes/deleteItem");
const itemsbasedonsections = require("./routes/itemsbasedonsections");
const previousOrders = require("./routes/previousOrders");
const getmessages = require("./routes/getmessages");
const setmessages = require("./routes/setmessages");



app.use("/", customerSignup);
app.use("/", ownerSignup);
app.use("/", login);
app.use("/", restaurantsbyItemName);
app.use("/", restaurantsbyItemCuisine);
app.use("/", getProfile);
app.use("/", updateprofile);
app.use("/", itemsByRestaurant);
app.use("/", additem);
app.use("/", allItems);
app.use("/", allsections);
app.use("/", addToCart);
app.use("/", deleteCartItem);
app.use("/", orderItems);
app.use("/", upcomingOrders);
app.use("/", allorders);
app.use("/", showcart);
app.use("/", deleteSection);
app.use("/", manageOrders);
app.use("/", updateSection);
app.use("/", updateItem);
app.use("/", deleteItem);
app.use("/", itemsbasedonsections);
app.use("/", previousOrders);
app.use("/", getmessages);
app.use("/", setmessages);


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

//Storing documents/Images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("test")
    cb(null, './uploads');
  }
  , filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

//uplaod-file
app.post('/upload-file', upload.array('photos', 5), (req, res) => {
  console.log('req.body', req.body);
  res.end();
});

//download-file
app.get('/download-file/:user_image', (req, res) => {
  console.log("inside download file", req.params.user_image)
  var image = path.join(__dirname + '/uploads', req.params.user_image);
  console.log("image path", image)
  if (fs.existsSync(image)) {
    res.sendFile(image)
  }
  else {
    res.end("image not found")
  }
});


//Port
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

module.exports = app;
