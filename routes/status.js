var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  res.json({ inAuction: aucStatus.inAuction,
             goingOnce: aucStatus.goingOnce,
             goingTwice: aucStatus.goingTwice,
             sold: aucStatus.sold,
             abort: aucStatus.abort,
             price: aucStatus.price,
             highBidder: aucStatus.highBidder,
             prize: aucStatus.prize });
});

module.exports = router;
