const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

//Initial function for the page
function init(){
  d3.json(url).then(function (data) {
    console.log(data)
  let selector = d3.select("#selDataset");
  let name = data.names;
  //Appending/creating items in the list and setting first id for the chart 
  data.names.forEach((id) => {
  selector.append("option").text(id).property("value", id);
  });
  let first_id = name[0]
  barchart(first_id);
  bubblechart(first_id);
  metadatainfo(first_id);
  panelInfo(first_id);
  });
}
//function for the optionchange event
function optionChanged(id_value) {
  barchart(id_value);
  bubblechart(id_value);
  metadatainfo(id_value);
  panelInfo(id_value);
}

// Set up variables and get data from JSON for bar charts 
function barchart(id_value){
d3.json(url).then(function (data) {
   console.log(data);
   let selector = d3.select("#selDataset");
   let sample = data.samples ;
   let current_sample = data.samples.filter(item => item.id == id_value);
   let first_sample = current_sample[0];
   console.log(current_sample);
 
   let otu_sample_id =  first_sample.otu_ids;
   let otu_sample_val = first_sample.sample_values;
   let otu_sample_label = first_sample.otu_labels;
   let otu_id_labels = otu_sample_id.slice(0,10).map(ID => `OTU ${ID}`).reverse();

//setting the trace for chart
  let trace1 = {
    x: otu_sample_val.slice(0,10).reverse(),
    y: otu_id_labels, 
    type: "bar",
    orientation: "h",
    text: otu_id_labels+otu_sample_label
    };
//setting the layout for the chart
  let layout = {
    margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 100
      }
    };
  Plotly.newPlot("bar", [trace1],layout);
});
}

// Set up variables and get data from JSON for bubble charts 
function bubblechart(id_value){
d3.json(url).then(function (data) {
  console.log(data)
  let selector = d3.select("#selDataset");
  //filtering the data for the selected id
  let current_sample = data.samples.filter(item => item.id == id_value);
  let first_sample = current_sample[0];

  let otu_id = first_sample.otu_ids.slice(0,10).reverse();
  let otu_val = first_sample.sample_values.slice(0,10).reverse();
  let otu_label = first_sample.otu_labels.slice(0,10).reverse();

 //setting the trace for chart
  let trace2 ={
   x: otu_id,
   y: otu_val,
   text: otu_label,
   mode: 'markers',
   marker:{ size: otu_val,
      color: otu_id
   }
   };
//setting the layout for the chart
  let layout = {
    xaxis:{title: 'OTU ID'},
    height: 600,
    width: 1200
  }
  Plotly.newPlot("bubble",[trace2],layout)

 });
}
//Creating Demographic information for the selected id
function metadatainfo(id_value){
  d3.json(url).then((data) => {
    let metadata = data.metadata;
    let demoinfo = data.metadata.filter(item => item.id == id_value);
    let results = demoinfo[0];
    let metaselect = d3.select("#sample-metadata");
    metaselect.html("");
    for (key in results){
      metaselect.append("h6").text(`${key}: ${results[key]}`);
    };
  }) ;
}
init();

// Bonus Gauge chart

function panelInfo(id_value) {
  // Enter the washing frequency between 0 and 180
  let level = parseFloat(id_value) * 20;

  // Trig to calc meter point
  let degrees = 180 - level;
  let radius = 0.5;
  let radians = (degrees * Math.PI) / 180;
  let x = radius * Math.cos(radians);
  let y = radius * Math.sin(radians);

  // Path: may have to change to create a better triangle
  let mainPath = "M -.0 -0.05 L .0 0.05 L ";
  let pathX = String(x);
  let space = " ";
  let pathY = String(y);
  let pathEnd = " Z";
  let path = mainPath.concat(pathX, space, pathY, pathEnd);

  let data = [
    {
      type: "scatter",
      x: [0],
      y: [0],
      marker: { size: 12, color: "850000" },
      showlegend: false,
      name: "Freq",
      text: level,
      hoverinfo: "text+name"
    },
    {
      values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
      rotation: 90,
      text: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
      textinfo: "text",
      textposition: "inside",
      marker: {
        colors: [
          "rgba(0, 105, 11, .5)",
          "rgba(10, 120, 22, .5)",
          "rgba(14, 127, 0, .5)",
          "rgba(110, 154, 22, .5)",
          "rgba(170, 202, 42, .5)",
          "rgba(202, 209, 95, .5)",
          "rgba(210, 206, 145, .5)",
          "rgba(232, 226, 202, .5)",
          "rgba(240, 230, 215, .5)",
          "rgba(255, 255, 255, 0)"
        ]
      },
      labels: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
      hoverinfo: "label",
      hole: 0.5,
      type: "pie",
      showlegend: false
    }
  ];

  let layout = {
    shapes: [
      {
        type: "path",
        path: path,
        fillcolor: "850000",
        line: {
          color: "850000"
        }
      }
    ],
    title: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week",
    height: 500,
    width: 500,
    xaxis: {
      zeroline: false,
      showticklabels: false,
      showgrid: false,
      range: [-1, 1]
    },
    yaxis: {
      zeroline: false,
      showticklabels: false,
      showgrid: false,
      range: [-1, 1]
    }
  };

  let GAUGE = document.getElementById("gauge");
  Plotly.newPlot(GAUGE, data, layout);
}



