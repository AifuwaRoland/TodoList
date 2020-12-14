const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
var items = ["Buy food"];
var workItems = [];
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/todolistDB', { useUnifiedTopology: true, useNewUrlParser: true });
//schema

const itemsSchema = new mongoose.Schema({
    name: String
});

//model
const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: "Welcome to your todolist!"
});
const item2 = new Item({
    name: "Hit the + button to add a new item"
});
const item3 = new Item({
    name: "<-- Hit this to delte an item"
});

// const defaultitems=[item1,item2,item3];



app.get("/", function (req, res) {
    var today = new Date();
    var options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };
    var day = today.toLocaleDateString("en-US", options);
    Item.find({}, function (err, foundItems) {
        if (foundItems.length == 0) {
            Item.insertMany([item1, item2, item3], function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Sucessfully save items to DB");
                }
            });
            res.redirect("/"); // go back to top 
        }else{
            res.render("list", { listTitle: day, newListItem: foundItems });
        }
       

    });





});
app.post("/", function (req, res) {
    const item=new Item({
        name:req.body.newItem
      });
    item.save();
    res.redirect("/");
    // if (req.body.list == "Work") {
    //     workItems.push(item);
    //     res.redirect("/work");
    // } else {
    //     items.push(item);
    //     res.redirect("/");

    // }


});
app.get("/work", function (req, res) {
    res.render("list", { listTitle: "Work List", newListItem: workItems });
});
app.post("/work", function (req, res) {
    var item = req.body.newItem;
    workItems.push(item);
    res.redirect("/work");
});
app.listen(3000, function () {

    console.log("server is running on port 3000");
});