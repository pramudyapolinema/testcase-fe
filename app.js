var express = require("express");
var logger = require("morgan");
var bodyParser = require("body-parser");
var multer = require("multer");
var forms = multer();

var indexRouter = require("./routes/index");
var productsRouter = require("./routes/products");
var usersRouter = require("./routes/users");

var app = express();

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(forms.array());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", indexRouter);
app.use("/api/v1/data", productsRouter);
app.use("/api/v1/users", usersRouter);

module.exports = app;
