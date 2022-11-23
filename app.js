const bodyParser = require("body-parser");
const express = require("express");
const _ = require("lodash");
const mongoose = require("mongoose");
const app = express();
const port = 3000;

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB");

const itemSchema = new mongoose.Schema({ name: String });

const Item = new mongoose.model("Item", itemSchema);

app.get("/", function (req, res) {
  Item.find({}, function (err, foundItem) {
    if (!err) {
      if (!foundItem) {
        res.render("index");
      } else {
        res.render("index", { todoItems: foundItem });
      }

      console.log(foundItem);
    }
  });
});

app.post("/", function (req, res) {
  const todoItem = req.body.todoItemInput;

  const item = new Item({ name: todoItem });
  item.save();

  res.redirect("/");
});

app.listen(port, function () {
  console.log(`Server is running at port: ${port}`);
});
