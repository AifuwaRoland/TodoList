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
        const customListName = req.params.customListName;
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
        List.findOne({  name: listName}, function(err, foundList) {
                foundList.items.push(item);
                foundList.save();
                res.redirect("/" + listName);
            });
    }


});
app.post("/delete", function (req, res) {
    const checklItemId = req.body.checkbox;
    Item.findByIdAndRemove(checklItemId, function (err) {
        if (err) {
            coinsole.print(err)
        } else {
            console.log("sucessfully deleted item from DB");
            res.redirect("/");
        }
    })

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