function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    var selector = d3.select("#sample-metadata");

    d3.json("/metadata/"+sample).then((obj) => {
      // Use `.html("") to clear any existing metadata
      selector.html("")
      // Use `Object.entries` to add each key and value pair to the panel
      for (let [key, value] of Object.entries(obj)) {
        selector
          .append("li")
          .text(`${key}: ${value}`);
      }
      });
    

    
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.


   
}

// @TODO: Use `d3.json` to fetch the sample data for the plots

    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
function buildCharts(sample) {
  d3.json("/samples/"+sample).then((obj) => {
    console.log(obj)  
    var otu_labels = obj.otu_labels;
    var otu_ids = obj.otu_ids;
    var sample_values = obj.sample_values;

    var trace1 = {
      values: sample_values.slice(0,10),
      labels: otu_ids.slice(0,10),
      hovertext: otu_labels.slice(0,10),
      type: 'pie'
    };

    var data = [trace1];
    
    var layout = {
      title: "'BellyButton' Chart",
    };

Plotly.plot("pie", data, layout);
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).


// Create bubble chart
var trace2 = {
  x: otu_ids,
  y: sample_values,
  mode: 'markers',
  marker: {
    size: sample_values,
    color: otu_ids,
  },
  text: otu_labels
};

var bubbledata = [trace2];

var bubblelayout = {
  title: 'Marker Size',
  showlegend: false,
  height: 1000,
  // width: 1000
};

Plotly.plot('bubble', bubbledata, bubblelayout, {showSendToCloud:true});
  
  
  })
}


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
