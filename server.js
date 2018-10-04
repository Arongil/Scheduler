var express = require("express");
var app = express();

app.use(express.static("C:\\Users\\Laker\\Desktop\\Scheduler"));

app.listen("3000");
console.log("Working on 3000");
