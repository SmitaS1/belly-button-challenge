const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Promise pending for obtaining JSON data from URL
const dataPromise = d3.json(url);
    console.log("Data Promise: ", dataPromise);

// // Fetch the JSON data and console log it
// d3.json(url).then(function(data){
//     console.log(data);
// });

// Set up variables and get data from JSON for charts 
var samples = [];

d3.json(url).then(function (data) {
    let selector = d3.select("#selDataset");
   let sample = data.samples[0];
   let otu = samples.otu_ids.slice(0,10);
   let otu_val = samples.sample_values.slice(0,10);
   
});

let trace1 = {
    x: otu.map(Object => Object.sample),
    y: otu_val.map(Object => Object.sample_values),
    type: "bar",
    orientation: "h"
  };

//function nameid(arr) {

// for (let i =0; i< arr.length; i++){
//     meta_data = arr[i];
//     name = meta_data.names[i];

// }
// }