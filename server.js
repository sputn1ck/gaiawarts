var Twit = require('twit')
var express = require('express');
var app = express()

var T = new Twit({
  consumer_key:         '7fJTxgtV2xS0LI43htQ6lLz7j',
  consumer_secret:      'POIZrfb2gF92dMu8qpxsOCt6JjzDqdZJUFPDB8uToR6QpeUd1E',
  access_token:         '811140087614423042-GWbB0inb9SN3c3lIfERaPUTFsATnesF',
  access_token_secret:  '2ZtQyjMkTxrpP3506XyvJFpZxfByzoNgcS5VkDrJg859H',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
})



app.get('/tweet', function (req, res) {
    var house = ""
    if(req.query.house == "g") {
        house = "Gryffindor";
    } else if (req.query.house == "r"){
      house = "Ravenclaw";
     }   else if(req.query.house == "h") {
        house = "Hufflepuff";
        } else {
            next();
        }
        var r = ""
        if(req.query.reason != undefined){
            r = ". Reason: " + req.query.reason;
        }
    var s = req.query.points + " Points for " + house + r;
    console.log(s);
  T.post('statuses/update', { status: s }, function(err, data, response) {
  console.log(data)
});
  res.send(s);
});

app.listen(process.env.PORT);