/**
 * Helper function to select stock data
 * Returns an array of values
 * @param {array} rows
 * @param {integer} index
 * index 0 - Date
 * index 1 - Open
 * index 2 - High
 * index 3 - Low
 * index 4 - Close
 * index 5 - Volume
 */
 function unpack(rows, index) {
  return rows.map(function(row) {
    return row[index];
  });
}

// Submit Button handler
function handleSubmit() {
  // Prevent the page from refreshing
  d3.event.preventDefault();

  // Select the input value from the form
  var stock = d3.select("#stockInput").node().value;
  console.log(stock);
  var startDate = d3.select("#startDate").node().value;
  console.log(startDate);
  var endDate = d3.select("#endDate").node().value;
  console.log(endDate);

  // clear the input value
  d3.select("#stockInput").node().value = "";
  d3.select("#startDate").node().value = "";
  d3.select("#endDate").node().value = "";

  // Build the plot with the new stock
  getMonthlyData(stock, startDate, endDate);
}

function getMonthlyData(stock, startDate, endDate) {
  var apiKey = "_JYx4iXZLFyMEQZB59du";
  var queryUrl = `https://www.quandl.com/api/v3/datasets/WIKI/${stock}.json?start_date=${startDate}&end_date=${endDate}&api_key=${apiKey}`;
  console.log(queryUrl);
  d3.json(queryUrl).then(function(data) {
    var dates = unpack(data.dataset.data, 0);
    var openPrices = unpack(data.dataset.data, 1);
    var highPrices = unpack(data.dataset.data, 2);
    var lowPrices = unpack(data.dataset.data, 3);
    var closingPrices = unpack(data.dataset.data, 4);
    var volume = unpack(data.dataset.data, 5);
    var table = d3.select("#summary-table");
    var tbody = table.select("tbody");
    var trow;
    for (var i = 0; i < dates.length; i++) {
      trow = tbody.append("tr");
      trow.append("td").text(dates[i]);
      trow.append("td").text(openPrices[i]);
      trow.append("td").text(highPrices[i]);
      trow.append("td").text(lowPrices[i]);
      trow.append("td").text(closingPrices[i]);
      trow.append("td").text(volume[i]);
    }
  })
}

d3.select("#submit").on("click", handleSubmit);