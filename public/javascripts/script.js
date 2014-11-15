var checkRate = 60000*5;

$(document).ready(function() {
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
                  checkRate = 5000;
                } else {
                  $("#status").text("Desert Bus IS NOT Currently Auctioning");
                  checkRate = 60000*5;
                }
              if (output.goingOnce) {
                $("#going").text("GOING ONCE!");
              } else if (output.goingTwice) {
                $("#going").text("GOING TWICE!!");
              } else if (output.sold) {
                $("#going").text("SOLD!!!!!!!");
              }
              $("#price").text(output.price);
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
    				},
    				async: true,
    				error: function() {
    					
    				}
				});
    }