function init(){
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("static/data/samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("static/data/samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("static/data/samples.json").then((data) => {
    
    
    // 3. Create a variable that holds the samples array. 
    var sampleData = data.samples;
    console.log(sampleData);

    // 3a. Variable that holds the metadata array.
    var metadata = data.metadata;
    console.log(metadata);


    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filteredResults = sampleData.filter(sampleNumber => sampleNumber.id == sample);
    console.log(filteredResults);

    // 4b. Create a variable that filters the metadata for the object with the desired sample number.
    var washfr = metadata.filter(sampleNumber => sampleNumber.id == sample);
    console.log(metadataArray);
  
    //  5. Create a variable that holds the first sample in the array.
    var firstResult = filteredResults[0];
    console.log(firstResult);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = firstResult.otu_ids;

    var otuLabels = firstResult.otu_labels;

    var sampleValues = firstResult.sample_values;

    console.log(otuIds);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otuIds.slice(0,10).map(x => "OTU " + x).reverse();


    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sampleValues,
      y: otuIds,
      text: otuLabels,
      type: "bar"
      }
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Best Bacteria Cultures Found",
      xaxis:{title:"Bacteria Count"},
      yaxis:{title:"Bacteria ID"},
      orientation: "h"
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuIds,
      y: sampleValues,
      mode: "markers",
      marker: {size: sampleValues, sizeref: 0.06, sizemode: "area"},
      text: otuLabels,
      type: "scatter",
      transforms: [{ type: "groupby", groups: OtuIds }],
    }

    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title : "Bacteria Cultures Per Sample ",
      xaxis: { title: "Bacteria ID" },
      yaxis: { title: "Count"},
      hovermode: "closest",
      autosize: "true", 
      margin: {
        l: 20,
        r: 20,
        b: 110,
        t: 110,
        pad: 5
      
      }
    };
    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("scatter", bubbleData, bubbleLayout); 

    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      domain: { x: [0, 1], y: [0, 1] },
      value: washfr,
      title: { text: "Washing Frequency" },
      type: "indicator",
      mode: "gauge+number"
    }
     
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 650, height: 575, margin: { t: 0, b: 0 }  
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge",gaugeData,gaugeLayout);
  });
};


