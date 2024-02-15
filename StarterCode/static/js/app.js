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
function panelInfo(id) {
  d3.json(url).then(function (data) {
      let sampleData = data;
      let metadata = sampleData.metadata;
      let identifier = metadata.filter(sample =>
          sample.id.toString() === id)[0];
      let panel = d3.select('#sample-metadata');
      panel.html('');
      Object.entries(identifier).forEach(([key, value]) => {
          panel.append('h6').text(`${key}: ${value}`);
      })
      let gaugeTrace = {
          domain: { x: [0, 5], y: [0, 1] },
          type: "indicator",
          ids: ['0-1', '1-2', '2-3', '3-4', '5-6', '6-7', '7-8', '8-9'],
          gauge: {
              axis: {
                  range: [0, 9],
                  tickmode: 'linear'
              },
              steps: [
                  { range: [0, 1], color: 'rgb(248,243,236)', id: '0-1' },
                  { range: [1, 2], color: 'rgb(244,241,228)', name: '1-2' },
                  { range: [2, 3], color: 'rgb(233,230,201)', name: '2-3' },
                  { range: [3, 4], color: 'rgb(229,232,176)', name: '3-4' },
                  { range: [4, 5], color: 'rgb(213,229,153)', name: '4-5' },
                  { range: [5, 6], color: 'rgb(183,205,143)', name: '5-6' },
                  { range: [6, 7], color: 'rgb(138,192,134)', name: '6-7' },
                  { range: [7, 8], color: 'rgb(137,188,141)', name: '7-8' },
                  { range: [8, 9], color: 'rgb(132,181,137)', name: '8-9' },
              ]
          },
          mode: "gauge"
      };
      let deg = (180 / 9) * identifier.wfreq;
      let radius = 0.5;
      let radians = (deg * Math.PI) / 180;
      let x = -1 * radius * Math.cos(radians);
      let y = radius * Math.sin(radians);
      let guageLayout = {
          title: "<b>Belly Button Washing Frequency</b> <br>Scrubs Per Week</br>",
          shapes: [{
              type: 'line',
              x0: 0.5,
              y0: 0,
              x1: x + 0.5,
              y1: y + 0.5,
              line: {
                  color: 'red',
                  width: 4
              }
          }],
          xaxis: { visible: true, range: [-1, 1] },
          yaxis: { visible: true, range: [-1, 1]},
          width: 800,
          height: 500

      };
     
      let gaugeData = [gaugeTrace];
      Plotly.newPlot('gauge', gaugeData, guageLayout);
  })
}