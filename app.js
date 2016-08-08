var express = require("express");
var hbs = require("express-handlebars");
var bodyParser = require("body-parser");
var path = require("path");
var api = require("./routes/api");

var app = express();

app.set("port", process.env.PORT || 8080);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.static(path.join(__dirname, "public")));
app.engine("hbs",hbs({extname: 'hbs', defaultLayout: 'main', layoutsDir: path.join(__dirname,"/views")}));
app.set("views",path.join(__dirname,"/views"));
app.set("view engine", "hbs");


app.get('/',function(req, res, next) {
   res.render('main'); 
});
app.use('/api/imagesearch', api);
app.listen(app.get("port"), function(){
   console.log("App is running at port: " + app.get("port")); 
});