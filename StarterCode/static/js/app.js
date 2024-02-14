const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Promise pending for obtaining JSON data from URL
const dataPromise = d3.json(url);
    console.log("Data Promise: ", dataPromise);

// // Fetch the JSON data and console log it
// d3.json(url).then(function(data){
//     console.log(data);
// });
d3.json(url).then(function (data) {
console.log(data)
let selector = d3.select("#selDataset");
let sample = data.samples[0];
let meta_data = data.metadata;
data.names.forEach((id) => {
  selector.append("option").text(id).property("value", id);
});

barchart(sample[0]);
bubblechart(sample[0]);
metadatainfo(sample[0]);
});

function optionChanged(value) {
  // const selectedId = data.samples.find((item) => item.id == value);
  // const demoid = data.metadata.find((item) => item.id == value);

  barchart(value);
  bubblechart(value);
  metadatainfo(value);

}

// Set up variables and get data from JSON for charts 
function barchart(value){
  console.log(value);
d3.json(url).then(function (data) {
   console.log(data);
   let selector = d3.select("#selDataset");
  //  let sample = data.samples[0] ;
   let sample = data.samples ;
   let current_sample = data.samples.filter(item => item.id == value);
   let first_sample = current_sample[0];
   console.log(current_sample);

  //  let otu_id = current_sample.id;
  //  console.log(ids);
   let otu_sample_id =  first_sample.otu_ids;
   let otu_sample_val = first_sample.sample_values;
   let otu_sample_label = first_sample.otu_labels;
  //  console.log(otu_id, otu_val,otu_label);
   
  let otu_id_labels = otu_sample_id.slice(0,10).map(ID => `OTU ${ID}`).reverse();
  let trace1 = {
    x: otu_sample_val.slice(0,10).reverse(),
    y: otu_id_labels, 
    type: "bar",
    orientation: "h",
    text: otu_id_labels+otu_sample_label,
    };

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

//Create a bubble chart that displays each sample
function bubblechart(value){
d3.json(url).then(function (data) {
  console.log(data)
  let selector = d3.select("#selDataset");
  let sample = data.samples[0];
  let otu_id = sample.otu_ids.slice(0,10).reverse();
  let otu_val = sample.sample_values.slice(0,10).reverse();
  let otu_label = sample.otu_labels.slice(0,10).reverse();

  console.log(otu_id, otu_val);

  let trace2 ={
   x: otu_id,
   y: otu_val,
   text: otu_label,
   mode: 'markers',
   marker:{ size: otu_val,
      color: otu_id
   }
   };

  let layout = {
    xaxis:{title: 'OTU ID'},
    height: 600,
    width: 1200
  }
  Plotly.newPlot("bubble",[trace2],layout)

 });
}

function metadatainfo(value){
  d3.json(url).then((data) => {
    let metadata = data.metadata;
    let demoinfo = data.metadata.filter(item => item.id == value);
    let results = demoinfo[0];
    let metaselect = d3.select("#sample-metadata");
    metaselect.html("");
    console.log('testing',value);
    for (key in results){
      metaselect.append("h6").text(`${key}: ${results[key]}
    }`);
    };
  }) ;
}