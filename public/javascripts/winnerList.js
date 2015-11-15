$(document).ready(function() {
   $.ajax({
    				type: 'GET',
    				url: "/winners",
    				dataType: 'json',
    				success: function(output) {
              var winnerList = output.winnerList;
              for (var x = 0; x < winnerList.length; x++) {
                var newRow = "<tr><td>";
                newRow += winnerList[x].prize;
                newRow += "</td><td>";
                newRow += winnerList[x].winner;
                newRow += "</td><td>";
                newRow += winnerList[x].price;
                newRow += "</td><td>";
                newRow += winnerList[x].time;
                newRow += "</td><tr>";
                $('table tbody').append(newRow);
              }
    				},
    				async: true,
    				error: function() {
    					var newRow = "<tr><td colspan='4'>ERROR: Unable To Retrieve Results</td></tr>";
              $('table tbody').append(newRow);
    				}
	});
});