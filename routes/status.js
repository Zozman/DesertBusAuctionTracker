var express = require('express');
var router = express.Router();

/*aucStatus = {
  inAuction: false,
  goingOnce: false,
  goingTwice: false,
  sold: false,
  price: "$0.00",
  highBidder: "",
  prize: ""
}*/

/* GET users listing. */
router.get('/', function(req, res) {
  res.json({ inAuction: aucStatus.inAuction,
             goingOnce: aucStatus.goingOnce,
             goingTwice: aucStatus.goingTwice,
             sold: aucStatus.sold,
             price: aucStatus.price,
             highBidder: aucStatus.highBidder,
             prize: aucStatus.prize});
});

module.exports = router;
