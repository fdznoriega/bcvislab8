
// load data
d3.csv("./driving.csv", d3.autoType)
    .then(data => {
        create(data);
    })

// dataset holder!
let dataset;

// create svg via margin convention
const margin = {top: 50, right: 50, bottom: 50, left: 50}
const width = 650 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

const svg = d3.select(".chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Create x- and y-scales
const x = d3.scaleLinear().range([0, width]);
const y = d3.scaleLinear().range([height, 0]);

// Generate axes
const xAxis = d3.axisBottom();
const yAxis = d3.axisLeft();

const xAxisSVG = svg.append("g")
                    .attr("class", "axis x-axis")
                    .attr("transform", `translate(0, ${height})`)


const yAxisSVG = svg.append("g")
                    .attr("class", "axis y-axis")

function create(data) {
    
    dataset = data;

    console.log(dataset);

    // update scales
    x.domain(d3.extent(dataset, d => d.miles)).nice();
    y.domain(d3.extent(dataset, d => d.gas)).nice();

    // update axes
    xAxis.scale(x);
    yAxis.scale(y);

    // ~ magic ~ time
    xAxisSVG
        .call(xAxis)
        // title!
        .call(g =>
            g.append("text")
                .attr("class", "x axis title")
                .attr("x", width)
                .attr("dy", -5)
                .attr("text-anchor", "end")
                .text("Miles per person per year")
                .call(halo)
            
        )
        // remove the bottom line!
        .call(g => g.select(".domain").remove())
        // stretch each mark by cloning the previous one!
        .call(g => 
            g.selectAll(".tick line")
                .clone()
                .attr("y2", -height)
                .attr("stroke-opacity", 0.25))
    
    yAxisSVG
        .call(yAxis)
        // title!
        .call(g =>
            g.append("text")
                .attr("class", "y axis title")
                .attr("text-anchor", "start")
                .attr("x", 5)
                .text("Price per gallon")
                .call(halo)
        )
        // remove the bottom line!
        .call(g => g.select(".domain").remove())
        // stretch each mark by cloning the previous one!
        .call(g => 
            g.selectAll(".tick line")
                .clone()
                .attr("x2", width )
                .attr("stroke-opacity", 0.25))

    // draw the line!
    const line = d3.line()
                    .curve(d3.curveCatmullRom)
                    .x(d => x(d.miles))
                    .y(d => y(d.gas))
    
    svg.append("path")
        .datum(dataset)
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-width", 2.5)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("d", line)

    // add circles for data points
    const circle = svg.selectAll(".circle")
                        .data(dataset)

    circle
        .join("circle")
        .attr("class", "circle")
        .attr("fill", "orange")
        .attr("cx", d => x(d.miles))
        .attr("cy", d => y(d.gas))
        .attr("r", 3)
    
    // add labels last for readabiltity
    const label = svg.selectAll("label")
                    .data(dataset)

    label
        .join("text")
        .attr("class", "label")
        .attr("transform", d => `translate(${x(d.miles)}, ${y(d.gas)})`)
        .text(d => d.year)
        .each(position)
        .call(halo)
        
}

function position(d) {
    const t = d3.select(this);
    switch (d.side) {
      case "top":
        t.attr("text-anchor", "middle").attr("dy", "-0.7em");
        break;
      case "right":
        t.attr("dx", "0.5em")
          .attr("dy", "0.32em")
          .attr("text-anchor", "start");
        break;
      case "bottom":
        t.attr("text-anchor", "middle").attr("dy", "1.4em");
        break;
      case "left":
        t.attr("dx", "-0.5em")
          .attr("dy", "0.32em")
          .attr("text-anchor", "end");
        break;
    }
}

function halo(text) {
    text
      .select(function() {
        return this.parentNode.insertBefore(this.cloneNode(true), this);
      })
      .attr("fill", "none")
      .attr("stroke", "rgb(49, 49, 49)")
      .attr("stroke-width", 4)
      .attr("stroke-linejoin", "round");
}
