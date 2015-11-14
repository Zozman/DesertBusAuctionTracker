var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var irc = require("irc");
var Parse = require('parse/node');
var routes = require('./routes/index');
var status = require('./routes/status');

var app = express();

// Initialize Parse
Parse.initialize(process.env.PARSEID, process.env.PARSEKEY);
 
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/status', status);

var oauth = process.env.TWITCHKEY;
var nick = process.env.TWITCHNAME;

var settings = {
    channels : ["#desertbus"],
    server : "irc.twitch.tv",
    port: 6667,
    secure: false,
    nick : nick,
    password : oauth
};

aucStatus = {
  inAuction: false,
  goingOnce: false,
  goingTwice: false,
  sold: false,
  price: "$0.00",
  highBidder: "???",
  prize: "???"
};

getLatestEvent();

var bot = new irc.Client(settings.server, settings.nick, {
    channels: [settings.channels + " " + settings.password],
    debug: false,
    password: settings.password,
    username: settings.nick
});

bot.addListener("message", function (from, to, message) {
    //console.log(from + ' => ' + to + ': ' + message);
    if (from === "bidbot") {
      if (message.indexOf("Starting Auction") > -1) {
        aucStatus.inAuction = true;
        aucStatus.price = message.substring(message.lastIndexOf("$"),message.indexOf("!"), message.lastIndexOf("$"));
        aucStatus.goingOnce = false;
        aucStatus.goingTwice = false;
        aucStatus.sold = false;
        aucStatus.highBidder = "";
        aucStatus.prize = message.substring(message.lastIndexOf(":")+2,message.indexOf("$")-4);
        saveEvent("auctionStart", message);
      } else if (message.indexOf("Going Once!") > -1) {
        aucStatus.goingOnce = true;
        aucStatus.goingTwice = false;
        aucStatus.sold = false;
        aucStatus.inAuction = true;
        aucStatus.price = message.substring(message.lastIndexOf("$"),SecondIndexOf("!", message));
        saveEvent("goingOnce", message);
      } else if (message.indexOf("Going Twice!") > -1) {
        aucStatus.goingOnce = false;
        aucStatus.goingTwice = true;
        aucStatus.sold = false;
        aucStatus.inAuction = true;
        aucStatus.price = message.substring(message.lastIndexOf("$"),SecondIndexOf("!", message));
        saveEvent("goingTwice", message);
      } else if (message.indexOf("SOOOOLLLLDDDD!!!!!!!") > -1) {
        aucStatus.goingOnce = false;
        aucStatus.goingTwice = false;
        aucStatus.sold = true;
        aucStatus.inAuction = false;
        aucStatus.price = message.substring(message.lastIndexOf("$"),xIndexOf("!", message, 8));
        saveEvent("sold", message);
      } else if (message.indexOf("has the high bid of") > -1) {
        aucStatus.goingOnce = false;
        aucStatus.goingTwice = false;
        aucStatus.sold = false;
        aucStatus.inAuction = true;
        var words = message.split(" ");
        for(var x = 0; x < words.length; x++) {
          if (words[x] === "has") {
            aucStatus.highBidder = words[x-1];
            break;
          }
        }
        aucStatus.price = message.substring(message.lastIndexOf("$"),message.indexOf("!", message.indexOf("$")));
        saveEvent("update", message);
      }
      console.log(aucStatus);
    }
});

bot.connect(function() {
    console.log("Connected!");
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

function SecondIndexOf(Val, Str)  
 {  
   var Fst = Str.indexOf(Val);  
   var Snd = Str.indexOf(Val, Fst+1);  
   return Snd;
 }  

 function xIndexOf(Val, Str, x)  
 {  
   if (x <= (Str.split(Val).length - 1)) {  
     Ot = Str.indexOf(Val);  
     if (x > 1) { for (var i = 1; i < x; i++) { var Ot = Str.indexOf(Val, Ot + 1); } }  
     return Ot;  
   } else { alert(Val + " Occurs less than " + x + " times"); return 0; }  
 }  

function saveEvent(eventName, message) {
  var AuctionEvent = Parse.Object.extend("AuctionEvent");
  var event = new AuctionEvent();
  
  event.set("eventName", eventName);
  event.set("message", message);
  event.set("inAuction", aucStatus.inAuction);
  event.set("goingOnce", aucStatus.goingOnce);
  event.set("goingTwice", aucStatus.goingTwice);
  event.set("sold", aucStatus.sold);
  event.set("price", aucStatus.price);
  event.set("highBidder", aucStatus.highBidder);
  event.set("prize", aucStatus.prize);

  event.save(null, {
    success: function(result) {
      //console.log('New event created with objectId: ' + result.id);
    },
    error: function(result, error) {
      console.log('Failed to create new event, with error code: ' + error.message);
    }
  });
}

function getLatestEvent() {
  var AuctionEvent = Parse.Object.extend("AuctionEvent");
  var query = new Parse.Query(AuctionEvent);
  query.limit(1);
  query.ascending("createdAt");
  query.find({
    success: function(result) {
      console.log("RETRIEVED ITEM!");
      aucStatus = {
        inAuction: result[0].get('inAuction'),
        goingOnce: result[0].get('goingOnce'),
        goingTwice: result[0].get('goingTwice'),
        sold: result[0].get('sold'),
        price: result[0].get('price'),
        highBidder: result[0].get('highBidder'),
        prize: result[0].get('prize')
      };
      console.log(aucStatus);
    },
    error: function(object, error) {
      console.log("ERROR: " + error);
      console.log("Failed to get latest item; Using Default");
      aucStatus = {
        inAuction: false,
        goingOnce: false,
        goingTwice: false,
        sold: false,
        price: "$0.00",
        highBidder: "???",
        prize: "???"
     };
    }
  });
}

module.exports = app;
