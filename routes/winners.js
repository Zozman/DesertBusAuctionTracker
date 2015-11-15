var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  var AuctionEvent = Parse.Object.extend("AuctionEvent");
  var query = new Parse.Query(AuctionEvent);
  query.equalTo("sold", true);
   query.find({
    success: function(result) {
      var winnerList = [];
      for (var x = 0; x < result.length; x++) {
        var object = result[x];
        winnerList.push({
          prize: object.get('prize'),
          winner: object.get('highBidder'),
          price: object.get('price'),
          time: object.get('createdAt')
        });
      }
      res.json({
        winnerList: winnerList,
        success: true,
        operation: 'winnerList'
      });
    },
    error: function(object, error) {
      res.json({
        success: false,
        operation: 'winnerList'
      });
    }
  });
});

module.exports = router;