const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require('lodash');

const app = express();
var items = ["Buy food"];
var workItems = [];
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect('mongodb+srv://Admin-Roland:test123@cluster0.a2yf9.mongodb.net/todolistDB', { useUnifiedTopology: true, useNewUrlParser: true });
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

const defaultitems = [item1, item2, item3];
const listSchema = {
    name: String,
    items: [itemsSchema]
};
const List = mongoose.model("List", listSchema);



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
        } else {
            res.render("list", { listTitle: "Today", newListItem: foundItems });
        }
    });

    app.get("/:customListName", function (req, res) { // create dynamic route name
        const customListName = _.capitalize(req.params.customListName);

        List.findOne({ name: customListName }, function (err, foundList) {
            if (!err) {
                if (!foundList) {

                    const list = new List({
                        name: customListName,
                        items: defaultitems
                    });
                    list.save();
                    res.redirect("/" + customListName);
                } else {

                    res.render("list", { listTitle: foundList.name, newListItem: foundList.items });
                }
            }
        });
    });



});
app.post("/", function (req, res) {
    const itemName = req.body.newItem;
    const listName = req.body.list;
    const item = new Item({
        name: itemName
    });

    if (listName == "Today") {
        item.save();
        res.redirect("/");
    } else {
        List.findOne({ name: listName }, function (err, foundList) {
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);
        });
    }


});
app.post("/delete", function (req, res) {
    const checklItemId = req.body.checkbox;
    const listName = req.body.listName;

    if (listName == "Today") {
        Item.findByIdAndRemove(checklItemId, function (err) {
            if (err) {
                coinsole.print(err)
            } else {
                console.log("sucessfully deleted item from DB");
                res.redirect("/");
            }
        });
    } else {
        List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checklItemId } } }, function (err, foundList) { //delete item from list
            if (!err) {
                res.redirect("/" + listName);
            }
        });
    }


});


app.get("/work", function (req, res) {
    res.render("list", { listTitle: "Work List", newListItem: workItems });
});
app.post("/work", function (req, res) {
    var item = req.body.newItem;
    workItems.push(item);
    res.redirect("/work");
});
let port= process.env.PORT;
if(port== null || port== ""){
    port=3000;
}
app.listen(port);
app.listen(port, function () {

    console.log("Server has started Sucessfully");
});