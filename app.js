const express = require("express");
const bodyParser = require("body-parser");
const mongoose= require("mongoose");

const app = express();
var items = ["Buy food"];
var workItems = [];
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/todolistDB', { useUnifiedTopology: true, useNewUrlParser: true });


app.get("/", function (req, res) {
    var today = new Date();
    var options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };
    var day = today.toLocaleDateString("en-US", options);


    res.render("list", { listTitle: day, newListItem: items }); // using EJS to pass day to list


});
app.post("/", function (req, res) {
    let item = req.body.newItem;
    if (req.body.list == "Work") {
        workItems.push(item);
        res.redirect("/work");
    } else {
        items.push(item);
        res.redirect("/");

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
app.listen(3000, function () {

    console.log("server is running on port 3000");
});