var checkRate = 5000;

$(document).ready(function() {
  checkStatus();
  setInterval(function(){
      checkStatus();
    },checkRate);
});

function checkStatus() {
    $.ajax({
    				type: 'GET',
    				url: "/status",
    				dataType: 'json',
    				success: function(output) {
                if (output.inAuction) {
                  $("#status").text("Desert Bus IS Currently Auctioning AWESOMENESS!!!");
                } else {
                  $("#status").text("Desert Bus IS NOT Currently Auctioning");
                }
              if (output.goingOnce) {
                $("#going").text("GOING ONCE!");
              } else if (output.goingTwice) {
                $("#going").text("GOING TWICE!!");
              } else if (output.sold) {
                $("#going").text("SOLD!!!!!!!");
              } else if (output.abort) {
                $("#going").text("AUCTION ABORTED!");
              } else {
                if (output.inAuction) {
                  $("#going").text("TAKE THE SHOT!!!");
                } else {
                  $("#going").text("HOLD!");
                }
              }
              if (output.inAuction) {
                $("#price").text("Current Bid: " + output.price);
              } else if (output.abort) {
                $("#price").text("Highest Bid Before Abort: " + output.price);
              } else {
                $("#price").text("Sold For: " + output.price);
              }
              if (output.startTime !== null) {
                $("#startTime").text("Auction Start Time: " + output.startTime);
              } else {
                $("#startTime").text("Auction Start Time: ???");
              }
              if (output.endTime !== null) {
                $("#endTime").text("Auction End Time: " + output.endTime);
              } else {
                $("#endTime").text("Auction End Time: ???");
              }
              $("#bidder").text("High Bidder: " + output.highBidder);
              if (output.prize !== null) {
                if (output.inAuction) {
                  $("#item").text("Current Auction Item: " + output.prize);
                } else if (output.abort) {
                  $("#item").text("Aborted Auction Item: " + output.prize);
                }else {
                  $("#item").text("Last Auction Item: " + output.prize);
                }
              }
    				},
    				async: true,
    				error: function() {
    					
    				}
				});
    }