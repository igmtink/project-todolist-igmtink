const express = require("express");
const app = express();
const port = 3000;

const bodyParser = require("body-parser");
const _ = require("lodash");
const mongoose = require("mongoose");

const today = require(__dirname + "/date.js");

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB");

const itemSchema = new mongoose.Schema({ name: String });

const Item = new mongoose.model("Item", itemSchema);

const item1 = new Item({ name: "Welcome to your todolist!" });
const item2 = new Item({
  name: "Hit the + button to add a new items.",
});
const item3 = new Item({ name: "<-- Hit this to delete an item." });

const defaultItems = [item1, item2, item3];

app.get("/", function (req, res) {
  Item.find({}, function (err, foundItem) {
    if (foundItem.length === 0) {
      // res.render("index", { title: "Todolist", date: today.getDate() });

      Item.insertMany(defaultItems, function (err) {
        res.redirect("/");
      });
    } else {
      res.render("index", {
        title: "Todolist",
        date: today.getDate(),
        todoItems: foundItem,
      });
    }
  });
});

const customListSchema = new mongoose.Schema({
  name: String,
  item: [itemSchema],
});

const CustomList = new mongoose.model("CustomList", customListSchema);

app.get("/:customListName", function (req, res) {
  const customList = _.startCase(req.params.customListName);
  CustomList.findOne({ name: customList }, function (err, foundItem) {
    if (!foundItem) {
      const customListItem = new CustomList({
        name: customList,
        item: defaultItems,
      });
      customListItem.save();

      // res.render("index", {
      //   title: customList,
      //   date: today.getDate(),
      //   todoItems: [],
      // });
      res.redirect("/" + customList);
    } else {
      res.render("index", {
        title: foundItem.name,
        date: today.getDate(),
        todoItems: foundItem.item,
      });
    }
  });
});

app.post("/", function (req, res) {
  const todoItem = req.body.todoItemInput;

  const customList = req.body.customListSubmit;

  const item = new Item({ name: todoItem });

  if (customList === "Todolist") {
    item.save();

    res.redirect("/");
  } else {
    CustomList.findOne({ name: customList }, function (err, foundList) {
      foundList.item.push(item);
      foundList.save();
      res.redirect("/" + customList);
    });
  }
});

app.post("/delete", function (req, res) {
  const itemId = req.body.checkbox;

  const customList = _.startCase(req.body.customListName);

  if (customList === "Todolist") {
    Item.findByIdAndRemove(itemId, function (err) {
      if (!err) {
        res.redirect("/");
      }
    });
  } else {
    CustomList.findOneAndUpdate(
      { name: customList },
      { $pull: { item: { _id: itemId } } },
      function (err, result) {
        res.redirect("/" + customList);
      }
    );
  }
});

app.listen(port, function () {
  console.log(`Server is running at port: ${port}`);
});
