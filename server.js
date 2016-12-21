var Twit = require('twit')
var express = require('express');
var app = express()
var port    = parseInt(process.env.PORT, 10) || 8080;
var mongo = require('mongodb')
const gpw = "harald";
const rpw = "chang"
const hpw = "diggory"

var T = new Twit({
  consumer_key:         '7fJTxgtV2xS0LI43htQ6lLz7j',
  consumer_secret:      'POIZrfb2gF92dMu8qpxsOCt6JjzDqdZJUFPDB8uToR6QpeUd1E',
  access_token:         '811140087614423042-GWbB0inb9SN3c3lIfERaPUTFsATnesF',
  access_token_secret:  '2ZtQyjMkTxrpP3506XyvJFpZxfByzoNgcS5VkDrJg859H',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
})

function tweet(s) {
  var s = s.points + " Points for " + s.house +". Reason: " + s.reason;
  T.post('statuses/update', { status: s }, function(err, data, response) {
  console.log(data)
});
}
const MongoClient = require('mongodb').MongoClient

app.set('view engine', 'ejs')

app.get('/tweet', function (req, res) {
    var house = ""
    if(req.query.house == "g") {
        house = "Gryffindor";
    } else if (req.query.house == "r"){
      house = "Ravenclaw";
     }   else if(req.query.house == "h") {
        house = "Hufflepuff";
        } else if(req.query.house == "s"){
            house = "Slytherin";
        }
        else {
          res.redirect('/'+req.query.housepw);
          return;
        }
        var r = ""
        if(req.query.reason != undefined){
            r = ". Reason: " + req.query.reason;
        }
    var s = req.query.points + " Points for " + house + r;
    var json = {"house":house, "points":req.query.points,"reason":req.query.reason,"approvals":[]};
    db.collection('tweetReqs').insert(json, (err, result) => {
    if (err) return console.log(err)

    console.log('saved to database')
    res.redirect('/'+req.query.housepw);
  })
  /*T.post('statuses/update', { status: s }, function(err, data, response) {
  console.log(data)
});*/
});

app.get('/approve/:id/:housepw', function(req, res) {
  console.log(req.params.id)
  var o_id = new mongo.ObjectID(req.params.id);
  var house = ""
  if(req.params.housepw == gpw) {
    house = "Gryffindor";
    console.log("gryf approved");
  }  else if(req.params.housepw == rpw) {
    house = "Ravenclaw";
    console.log("Rav approved");
  }else if(req.params.housepw == hpw) {
    house = "Hufflepuff";
    console.log("huf approved");
  } else {
    res.redirect('/' + req.params.housepw);
    return;
  }

  db.collection('tweetReqs').update({"_id":o_id}, {$addToSet:{"approvals":house}}, function(err) {
    db.collection('tweetReqs').find({"_id":o_id}).toArray(function(err, results) {
      if(results[0] != undefined){
      if(results[0].points<=0&&results[0].approvals.length >= 2) {
        console.log("contains");
        tweet(results[0]);
        db.collection('tweetReqs').remove({"_id":o_id});
       }
       if(results[0].approvals.length >= 3) {
        console.log("contains");
        tweet(results[0]);
        db.collection('tweetReqs').remove({"_id":o_id});
       }
     }
     });
  });
  res.redirect('/'+req.params.housepw)
});

app.get('/:housepw', function(req,res) {
  if(req.query.housepw != undefined) {
    res.redirect('/'+req.query.housepw);
  }
  db.collection('tweetReqs').find().toArray((err, result) => {
    if (err) return console.log(err)
    // renders index.ejs
    res.render('index.ejs', {tweetReqs: result, housepw: req.params.housepw});
  })
})

app.get('/', function(req,res) {
  db.collection('tweetReqs').find().toArray((err, result) => {
    if (err) return console.log(err)
    // renders index.ejs
    res.render('login.ejs');
  })
})


MongoClient.connect('mongodb://bob:reinreinrein@ds141088.mlab.com:41088/gaiawarts', (err, database) => {
    if (err) return console.log(err)
  db = database
  app.listen(port, () => {
    console.log('listening on ' + port)
  })
})
//app.listen('8080')