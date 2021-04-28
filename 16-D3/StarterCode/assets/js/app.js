// Initial global Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

$(document).ready(function() {
    makePlot();

    $(window).resize(function() {
        makePlot();
    });
});

function makePlot() {
    // d3.csv("assets/data/data.csv").then(data)
    // console.log(data);

    d3.csv("assets/data/data.csv").then(function(uscData) {
        console.log(uscData);
        // STEP 1: SET UP THE CANVAS
        $("#chart").empty();

        var svgWidth = 980;
        var svgHeight = 600;

        var margin = {
            top: 20,
            right: 40,
            bottom: 90,
            left: 100
        };

        var chart_width = svgWidth - margin.left - margin.right;
        var chart_height = svgHeight - margin.top - margin.bottom;

        // STEP 2: CREATE THE SVG (if it doesn't exist already)
        // Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
        var svg = d3.select("#scatter")
            .append("svg")
            .attr("width", svgWidth)
            .attr("height", svgHeight)
            .classed("chart", true);

        var chartGroup = svg.append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);


        // STEP 3: PREPARE THE DATA
        uscData.forEach(function(row) {
            row.healthcareLow = +row.healthcareLow;
            row.poverty = +row.poverty;
            row.age = +row.age;
            row.obesity = +row.obesity;
            row.income = +row.income;
            row.smokes = +row.smokes;
        });

        // STEP 4: Create the Scales
        var xScale = d3.scaleLinear()
            .domain([d3.min(uscData, d => d.poverty) * 0.9, d3.max(uscData, d => d.poverty) * 1.1])
            .range([0, chart_width]);

        var yScale = d3.scaleLinear()
            .domain([d3.min(uscData, d => d.healthcareLow), d3.max(uscData, d => d.healthcareLow) * 1.1])
            .range([chart_height, 0]);


        // STEP 5: CREATE THE AXES
        var leftAxis = d3.axisLeft(yScale);
        var bottomAxis = d3.axisBottom(xScale);

        chartGroup.append("g")
            .attr("transform", `translate(0, ${chart_height})`)
            .call(bottomAxis);

        chartGroup.append("g")
            .call(leftAxis);

        // STEP 6: CREATE THE GRAPH
        // Create & Append Initial Circles
        var circlesGroup = chartGroup.selectAll("stateCircle")
            .data(uscData)
            .enter()
            .append("circle")
            // .attr("cx", d => xScale(d.poverty))
            // .attr("cy", d => yScale(d.healthcare))
            // .attr("r", "12")
            .attr("stroke-width", "0.3")
            .style("opacity", 0.5)
            .classed("stateCircle", true);


        // append text to circles
        var textGroup = chartGroup
            .selectAll("stateText")
            .data(uscData)
            .enter()
            .append("text")
            .text(d => (d.abbr))
            .attr("alignment-baseline", "central")
            // .attr("x", d => xScale(d.poverty))
            // .attr("y", d => yScale(d.healthcare))
            .attr("font-size", 12)
            .classed("stateText", true);

        // STEP 6.5:Have the circles fly
        chartGroup.selectAll("circle")
            .transition()
            .duration(5000)
            .attr("cx", d => xScale(d.poverty))
            .attr("cy", d => yScale(d.healthcare))
            .attr("r", "12")
            .style("opacity", 0.5)
            .delay(function(d, i) { return i * 100 });

        chartGroup.selectAll(".stateText")
            .transition()
            .duration(5000)
            .attr("x", d => xScale(d.poverty))
            .attr("y", d => yScale(d.healthcare))
            .delay(function(d, i) { return i * 100 });

        // STEP 7: Add Axes Labels
        // Create axes labels
        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + 0)
            .attr("x", 0 - (chart_height / 2))
            .attr("dy", "1em")
            .attr("class", "axisText")
            .text("Lacks Healthcare %");

        chartGroup.append("text")
            .attr("transform", `translate(${chart_width / 2}, ${chart_height + margin.top + 30})`)
            .attr("class", "axisText")
            .text("Poverty %");

        // STEP 8: TOOLTIP
        // Step 1: Initialize Tooltip
        var toolTip = d3.tip()
            .attr("class", "d3-tip")
            .offset([80, 80])
            .html(function(d) {
                return (`<strong>${d.state}<strong><br><strong>Poverty: ${d.poverty}%</strong><br><strong>Lacks Healthcare: ${d.healthcare}%</strong>`);
            });

        // Step 2: Create the tooltip in chartGroup.
        circlesGroup.call(toolTip);

        // Step 3: Create "mouseover" event listener to display tooltip
        circlesGroup.on("mouseover", function(event, d) {
                toolTip.show(d, this);

                //make bubbles big
                d3.select(this)
                    .transition()
                    .duration(1000)
                    .attr("r", 50);

            })
            // Step 4: Create "mouseout" event listener to hide tooltip
            .on("mouseout", function(event, d) {
                toolTip.hide(d);

                d3.select(this)
                    .transition()
                    .duration(1000)
                    .attr("r", 12);

            });


    }).catch(function(error) {
        console.log(error);



    });

}