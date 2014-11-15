$(document).ready(function() {
  setInterval(function(){
      checkStatus();
    },5000);
});

function checkStatus() {
    $.ajax({
    				type: 'GET',
    				url: "/status",
    				dataType: 'json',
    				success: function(output) {
                if (output.inAuction) {
                  $("#status").text("Desert Bus IS Currently Auctioning");
                } else {
                  $("#status").text("Desert Bus IS NOT Currently Auctioning");
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
                $("#startTime").text(output.startTime);
              } else {
                $("#startTime").text("???");
              }
              if (output.endTime !== null) {
                $("#endTime").text(output.endTime);
              } else {
                $("#endTime").text("???");
              }
              $("#bidder").text("High Bidder: " + output.highBidder);
    				},
    				async: true,
    				error: function() {
    					
    				}
				});
    }