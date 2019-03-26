// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 40,
    right: 40,
    bottom: 75,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv")
    .then(function (newsData) {
console.log(newsData);

// Step 1: Parse Data/Cast as numbers
// ==============================
newsData.map(function (data) {
    data.poverty = +data.poverty;
    data.obesity = +data.obesity;
    //data.smokers = +data.smokers;
    //data.lacks
});

// Step 2: Create scale functions
// ==============================
var xLinearScale = d3.scaleLinear()
    .domain([10, d3.max(newsData, d => d.poverty)])
    .range([0, width]);

var yLinearScale = d3.scaleLinear()
    .domain([10, d3.max(newsData, d => d.obesity)])
    .range([height, 0]);

// Step 3: Create axis functions
// ==============================
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

// Step 4: Append Axes to the chart
// ==============================
chartGroup.append("scatter")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

chartGroup.append("scatter")
    .call(leftAxis);

// Step 5: Create Circles
//http://bl.ocks.org/davegotz/bd54b56723c154d25eedde6504d30ad7
// ==============================
var circlesGroup = chartGroup.selectAll("circle")
    .data(newsData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.obesity))
    .attr("r", "15")
    .attr("fill", "pink")
    .attr("opacity", ".5")
    .text(d => (d.abbr));//(still not appending the addr fo the state to the plot)

// Step 6: Initialize tool tip
// ==============================
var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function (d) {
        return (`${d.state}<br>Poverty: ${d.poverty}%<br>Obesity: ${d.obesity}%`);
    });

// Step 7: Create tooltip in the chart
// ==============================
chartGroup.call(toolTip);

// Step 8: Create event listeners to display and hide the tooltip
// ==============================
circlesGroup.on("mouseover", function (data) {
    toolTip.show(data, this);
})
    // onmouseout event
    .on("mouseout", function (data) {
        toolTip.hide(data);
    });

// Create axes labels
chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Obesity(%)");

chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .text("Poverty(%)")
    .attr("class", "axisText");
  });