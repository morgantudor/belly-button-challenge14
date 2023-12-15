const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Dropdown menu
function init() {

    let dropdownMenu = d3.select("#selDataset");

    d3.json(url).then((data) => {
        console.log(`Data: ${data}`);

        let names = data.names;

        names.forEach((name) => {
            dropdownMenu.append("option").text(name).property("value", name);
        });

        let name = names[0];


        // Call functions
        demo(name);
        bar(name);
        bubble(name);
        gauge(name);
    });
}

// Demo panel
function demo(selectedValue) {

    d3.json(url).then((data) => {
        console.log(`Data: ${data}`);

        let metadata = data.metadata;
        let filteredData = metadata.filter((meta) => meta.id == selectedValue);
      
        let obj = filteredData[0]
        
        d3.select("#sample-metadata").html("");
  
        let entries = Object.entries(obj);
        
        entries.forEach(([key,value]) => {
            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });

        console.log(entries);
    });
  }
  

// Bar chart
function bar(selectedValue) {

    d3.json(url).then((data) => {
        console.log(`Data: ${data}`);

        let samples = data.samples;

        let filteredData = samples.filter((sample) => sample.id === selectedValue);

        let obj = filteredData[0];
        
        let trace = [{
            x: obj.sample_values.slice(0,10).reverse(),
            y: obj.otu_ids.slice(0,10).map((otu_id) => `OTU ${otu_id}`).reverse(),
            text: obj.otu_labels.slice(0,10).reverse(),
            type: "bar",
            marker: {
                color: "cornstalk"
            },
            orientation: "h"
        }];
        
        Plotly.newPlot("bar", trace);
    });
}
  
// Bubble chart
function bubble(selectedValue) {

    d3.json(url).then((data) => {

        let samples = data.samples;
    
        let filteredData = samples.filter((sample) => sample.id === selectedValue);
    
        let obj = filteredData[0];
        
        let trace = [{
            x: obj.otu_ids,
            y: obj.sample_values,
            text: obj.otu_labels,
            mode: "markers",
            marker: {
                size: obj.sample_values,
                color: obj.otu_ids,
                colorscale: "Bluered"
            }
        }];
    
        let layout = {
            xaxis: {title: "OTU ID"}
        };
    
        Plotly.newPlot("bubble", trace, layout);
    });
}

// Gauge chart 
function gauge(selectedValue) {
    d3.json(url).then((data) => {

        let metadata = data.metadata;
        
        let filteredData = metadata.filter((meta) => meta.id == selectedValue);
      
        let obj = filteredData[0]

        let trace = [{
            domain: { x: [0, 1], y: [0, 1] },
            value: obj.wfreq,
            title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week", font: {size: 22}},
            type: "indicator", 
            mode: "gauge+number",
            gauge: {
                axis: {range: [0, 10]}, 
                bar: {color: "rgb(153,153,255)"},
                steps: [
                    { range: [0, 1], color: "rgb(255,255,255)" },
                    { range: [1, 2], color: "rgb(229,204,255)" },
                    { range: [2, 3], color: "rgb(204,153,255)" },
                    { range: [3, 4], color: "rgb(178,102,255)" },
                    { range: [4, 5], color: "rgb(153,51,255)" },
                    { range: [5, 6], color: "rgb(127,0,255)" },
                    { range: [6, 7], color: "rgb(102,0,204)" },
                    { range: [7, 8], color: "rgb(76,0,153)" },
                    { range: [8, 9], color: "rgb(51,0,102)" },
                    { range: [9, 10], color: "rgb(25,0,51)" }
                ]
            }
        }];

         Plotly.newPlot("gauge", trace);
    });
}

// Update based on dropdown selection
function optionChanged(selectedValue) {
    demo(selectedValue);
    bar(selectedValue);
    bubble(selectedValue);
    gauge(selectedValue)
}

init();