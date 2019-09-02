const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

// dotenv configuration
require("dotenv").config();

// Init app
const app = express();

// email send
// const email = require("./routes/api/common/emailNotification");

//routes for admin functionalities
const admin_bonus = require("./routes/api/admin/bonus");
const admin_creditPoint = require("./routes/api/admin/creditPoint");
const admin_customer = require("./routes/api/admin/customer");
const admin_product = require("./routes/api/admin/product");

//routes for user functionalities
const user_creditPoint = require("./routes/api/user/creditPoint");
const user_customer = require("./routes/api/user/customer");

//routes for common to both admin and user/ agent
const auth = require('./routes/api/common/auth');
const payment = require('./routes/api/common/payment');
const common_customerRead = require("./routes/api/common/customerRead");
const common_notification = require('./routes/api/common/notification');
const common_productRead = require("./routes/api/common/productRead");


//Body parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(db)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

//passport middleware
app.use(passport.initialize());

//passport Config
require("./config/passport.js")(passport);


// use routes

//admin functionality routes
app.use('/api/admin/bonus', admin_bonus)
app.use('/api/admin/creditPoint', admin_creditPoint)
app.use('/api/admin/customer', admin_customer)
app.use('/api/admin/product', admin_product)

//user/agent functionality routes
app.use('/api/user/creditPoint', user_creditPoint)
app.use('/api/user/customer', user_customer)

//common routes for both user and admin
app.use('/api/common/auth', auth);
app.use('/api/common/payment', payment);
app.use('/api/common/customerRead', common_customerRead);
app.use('/api/common/notification', common_notification);
app.use('/api/common/productRead', common_productRead);

// email notification
// app.use('/api/common/emailNotification', email);

//configuring port
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));