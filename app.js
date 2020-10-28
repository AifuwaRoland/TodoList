const express = require("express");
const bodyParser = require("body-parser");


const app = express();
var items=["Buy food"];
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));




app.get("/", function (req, res) {
    var today = new Date();
    var currDay = today.getDay();
    var options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };
    var day = today.toLocaleDateString("en-US", options);


    res.render("list", { kindOfDay: day, newListItem: items}); // using EJS to pass day to list


});
app.post("/", function (req, res) {
    var item=req.body.newItem;
     items.push(item);
    res.redirect("/");

});
app.listen(3000, function (req, res) {

    console.log("server is running on port 3000");
});