//set global variable
var global_data = [];
//Use jQuery to build the function after the page load
$(document).ready(function() {
    onInit();
    // call event listener
    $('#selDataset').change(function() {
        doThing();

    });
});

//Use `d3.json` to fetch the metadata for a sample
function onInit() {
    d3.json("samples.json").then((data) => {
        // save data to global
        global_data = data;

        //make filter
        makeFilters(data);
        doThing();
    });
}

function doThing() {

    // grab first name in dropdown
    var sample = parseInt($("#selDataset").val());

    // filter the metadata
    var metadata = global_data.metadata.filter(x => x.id === sample)[0];

    // filter the sample data 
    // data types are different
    var sample_data = global_data.samples.filter(x => x.id == sample)[0];

    // build the charts
    makePanel(metadata);
    makePlots(sample_data, metadata);
}

function makePlots(sample_data, metadata) {

    makeBar(sample_data);
    makeBubble(sample_data);
    makeGauge(metadata);
}
//use jQuery to  dynamically add test Subject ID No. to the dropdown menu
function makeFilters(data) {

    data.names.forEach(function(val) {
        var newOption = `<option>${val}</option>`;
        $('#selDataset').append(newOption);
    });
}

function makePanel(metadata) {
    //wipe the panel
    $("#sample-metadata").empty();

    // display each key-value pair from the metadata JSON object
    Object.entries(metadata).forEach(function([key, value]) {
        var entry = `<span><b>${key}: </b>${value}</span><br>`;
        $("#sample-metadata").append(entry);
    });
}
// bar chart select the top 10 OTUs for the ID with their sample_values, otu_ids and otu_labels
function makeBar(sample_data) {

    var y_labels = sample_data.otu_ids.slice(0, 10).reverse().map(x => `OTU:${x}`); // make string
    var trace = {
        x: sample_data.sample_values.slice(0, 10).reverse(),
        y: y_labels,
        text: sample_data.otu_labels.slice(0, 10).reverse(),
        type: 'bar',
        orientation: "h",
        marker: {
            color: 'rgb(142,124,195)',
            opacity: 0.6,
            line: {
                color: 'rgb(8,48,107)',
                width: 1.5
            }
        }

    };

    var layout = {
        title: "Top Bacteria Present in Subject Belly Button",
        xaxis: { title: "Amount of Bacteria" },
        yaxis: { title: "Bacteria ID", tickangle: -45 }
    }

    var traces = [trace];

    Plotly.newPlot('bar', traces, layout);
}

function makeBubble(sample_data) {
    // make bubble plot
    var trace = {
        x: sample_data.otu_ids,
        y: sample_data.sample_values,
        mode: 'markers',
        marker: {
            size: sample_data.sample_values,
            color: sample_data.otu_ids,
            symbol: 'diamond'
        },
        text: sample_data.otu_labels
    };

    var traces = [trace];

    var layout = {
        title: "Amount of Bacteria Present in Subject Belly Button",
        xaxis: { title: "Bacteria ID" },
        yaxis: { title: "Amount of Bacteria" }
    }

    Plotly.newPlot('bubble', traces, layout);
}

function makeGauge(metadata) {
    var max_wfreq = 10;

    // make Gauge Chart
    var trace = {
        domain: { x: [0, 1], y: [0, 1] },
        value: metadata.wfreq,
        title: { text: "Belly Button Washing Frequency" },
        type: "indicator",
        gauge: {
            axis: { range: [null, max_wfreq] },
            steps: [
                { range: [0, 1], color: 'rgb(248, 243, 236)' },
                { range: [1, 2], color: 'rgb(244, 241, 229)' },
                { range: [2, 3], color: 'rgb(233, 230, 202)' },
                { range: [3, 4], color: 'rgb(229, 231, 179)' },
                { range: [4, 5], color: 'rgb(213, 228, 157)' },
                { range: [5, 6], color: 'rgb(183, 204, 146)' },
                { range: [6, 7], color: 'rgb(140, 191, 136)' },
                { range: [7, 8], color: 'rgb(138, 187, 143)' },
                { range: [8, 9], color: 'rgb(133, 180, 138)' },
            ],
            threshold: {
                line: { color: 'rgba(219, 64, 82, 0.7)', width: 4 },
                thickness: 0.75,
                value: 2
            }
        },
        mode: "gauge+number"
    };
    var traces = [trace];

    var layout = {}
    Plotly.newPlot('gauge', traces, layout);
}