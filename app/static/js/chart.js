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
  buildPlot(stock, startDate, endDate);
}

function buildPlot(stock, startDate, endDate) {
  var apiKey = "_JYx4iXZLFyMEQZB59du";
  var url = `https://www.quandl.com/api/v3/datasets/WIKI/${stock}.json?start_date=${startDate}&end_date=${endDate}&api_key=${apiKey}`;

  d3.json(url).then(function(data) {
    // Grab values from the response json object to build the plots
    var name = data.dataset.name;
    var stock = data.dataset.dataset_code;
    var startDate = data.dataset.start_date;
    var endDate = data.dataset.end_date;
    var dates = unpack(data.dataset.data, 0);
    var openingPrices = unpack(data.dataset.data, 1);
    var highPrices = unpack(data.dataset.data, 2);
    var lowPrices = unpack(data.dataset.data, 3);
    var closingPrices = unpack(data.dataset.data, 4);
    var volume = unpack(data.dataset.data, 5);
    // Print the names of the columns
    console.log(data.dataset.column_names);

    var trace1 = {
      type: "scatter",
      mode: "lines",
      name: name,
      x: dates,
      y: closingPrices,
      line: {
        color: "#17BECF"
      }
    };
    // Candlestick Trace
    var trace2 = {
      type: "candlestick",
      x: dates,
      high: highPrices,
      low: lowPrices,
      open: openingPrices,
      close: closingPrices
    };

    var trace3 = {
      x: dates,
      y: volume,
      type: "scatter",
      mode: "lines",
      xaxis: "x2",
      yaxis: "y2",
      name: "Volume",

    };

    var moveMean = [];
    for (var i = 1; i < closingPrices.length-1; i++)
    {
      var mean = (closingPrices[i-9] + closingPrices[i-8] + closingPrices[i-7] + closingPrices[i-6] + closingPrices[i-5] + closingPrices[i-4]
        + closingPrices[i-3] + closingPrices[i-2] + closingPrices[i-1] + closingPrices[i] + closingPrices[i+1] + closingPrices[i+2]
        + closingPrices[i+3] + closingPrices[i-4] + closingPrices[i+5] + closingPrices[i+6] + closingPrices[i+7] + closingPrices[i+8] + closingPrices[i+9])/20.0;
      moveMean.push(mean);
    }

    var trace4 = {
      x:dates,
      y:moveMean,
      type: "scatter",
      mode: "lines",
      name: "Moving Average",
      xaxis:"x3",
      yaxis:"y3"
    };


    var data = [trace1, trace2, trace3, trace4];

    var layout = {
      autosize: false,
      width: 1050,
      height: 1050,
      title: `${stock} Closing Prices , Volume History & 20-Day Moving Average`,
      xaxis: {
        range: [startDate, endDate],
        type: "date"
      },
      yaxis: {
        autorange: true,
        type: "linear"
      },
      grid: {rows: 3, columns: 1, pattern: 'independent'},
    };

    Plotly.newPlot("plot", data, layout);

  });
}

// Add event listener for submit button
d3.select("#submit").on("click", handleSubmit);
