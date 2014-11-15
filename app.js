var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var irc = require("irc");
var routes = require('./routes/index');
var status = require('./routes/status');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/status', status);

var oauth = "oauth:vvvvag3gfijrx5x3hkqlo5zqo3pb11"

var settings = {
    channels : ["#desertbus"],
    server : "irc.twitch.tv",
    port: 6667,
    secure: false,
    nick : "dbauctionwatch",
    password : oauth
}

aucStatus = {
  inAuction: false,
  goingOnce: false,
  goingTwice: false,
  sold: false,
  price: "$0.00",
  highBidder: "",
  prize: "",
  startTime: null,
  endTime: null
}

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
        aucStatus.price = message.substring(message.lastIndexOf("$"),message.lastIndexOf("!"));
        aucStatus.goingOnce = false;
        aucStatus.goingTwice = false;
        aucStatus.sold = false;
        aucStatus.highBidder = "";
        aucStatus.prize = message.substring(message.lastIndexOf(":")+2,message.indexOf("$")-4);
        var newDate = new Date();
        startTime = newDate.today() + " " + newDate.timeNow();
        endTime = null;
      } else if (message.indexOf("Going Once!") > -1) {
        aucStatus.goingOnce = true;
        aucStatus.goingTwice = false;
        aucStatus.sold = false;
        aucStatus.inAuction = true;
      } else if (message.indexOf("Going Twice!") > -1) {
        aucStatus.goingOnce = false;
        aucStatus.goingTwice = true;
        aucStatus.sold = false;
        aucStatus.inAuction = true;
      } else if (message.indexOf("SOOOOLLLLDDDD!!!!!!!") > -1) {
        aucStatus.goingOnce = false;
        aucStatus.goingTwice = false;
        aucStatus.sold = true;
        aucStatus.inAuction = false;
        var new2Date = new Date();
        endTime = new2Date.today() + " " + new2Date.timeNow();
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
        aucStatus.price = message.substring(message.lastIndexOf("$"),message.lastIndexOf("!"));
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

// For todays date;
Date.prototype.today = function () { 
    return ((this.getDate() < 10)?"0":"") + this.getDate() +"/"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"/"+ this.getFullYear();
}

// For the time now
Date.prototype.timeNow = function () {
     return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
}

module.exports = app;
