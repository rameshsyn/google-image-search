var router = require("express").Router();
var mongoose = require("mongoose");
var google = require("googleapis"); // google api module
var customSearch = google.customsearch('v1'); // google customsearch api
mongoose.connect(process.env.MONGOLAB_URI);
mongoose.connection.once('open',function(){
   console.log("DB connected !");
});
// latest image search query schema
var latestSearchSchema = new mongoose.Schema({
    query: String,
    date: String
});

// latest image search query modal
var latestSearch = mongoose.model('latestSearch', latestSearchSchema);

// when image query is got from post method
router.post('/', function(req, res) {
    var searchQuery = req.body.searchQuery;
    var url = '/api/imagesearch?q='+searchQuery; 
    res.redirect(url); // redirects to url (get method)
});

// when image query is got from get method
router.get('/', function(req,res, next){
       var searchQuery = req.query.q;
       var format = req.query.format;
       var url = '/api/imagesearch?q=' + searchQuery +'&format=json';
    // params send to custom search api
       var params = {
        cx: '013497436513323115314:kxwfxuzsm8q',
        searchType: 'image',
        key: 'AIzaSyC96Dl1uVLaoD7NswZcDdpJX0tRK2yjJ04',
        q: searchQuery,
        };
        customSearch.cse.list(params, function(err, searchData) {
         var requiredData = [];
         if(err) throw err;
         new latestSearch({
             query: searchQuery,
             date: Date.now()
         }).save();
         searchData.items.forEach(function(image) {
             return requiredData.push({
                 title: image.title,
                 link: image.link
             })
         });
         // responds json if format query is setted
         if(format) {
             res.json(requiredData);
         }
         // renders search results to main page
         else {
         res.render('main', { 
             data: requiredData, 
             jsonlink: url
         });
         }
    });
});

// responds to latest request
router.get('/latest', function(req, res, next) {
  latestSearch.find({}, function(err, data){
      var queries = [];
      if(err) throw err;
      data.forEach(function(q){
         return queries.push({
            query: q.query,
            date: new Date(parseInt(q.date)).toGMTString()
         });
      });
      res.json(queries);
  }); 
});

module.exports = router;