const express = require("express");
const bodyParser = require("body-parser");


const app = express();
var items = ["Buy food"];
var workItems = [];
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));



app.get("/", function (req, res) {
    var today = new Date();
    var currDay = today.getDay();
    var options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };
    var day = today.toLocaleDateString("en-US", options);


    res.render("list", { listTitle: day, newListItem: items }); // using EJS to pass day to list


});
app.post("/", function (req, res) {
    var item = req.body.newItem;
    items.push(item);
    res.redirect("/");

});
app.get("/work", function (req, res) {
    res.render("list", { listTitle: "Work List", newListItem: workItems });
});
app.post("/work", function (req, res) {
    var item = req.body.newItem;
    workItems.push(item);
    res.redirect("/work");
});
app.listen(3000, function (req, res) {

    console.log("server is running on port 3000");
});