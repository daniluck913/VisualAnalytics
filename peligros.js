/**
 * Javascript que permite gestionar GRAFICA PELIGROS
 *
 * @package         SAR
 * @subpackage      SGSST
 * @category        Jasvascript
 * @author          Answecpi.com 
 * @author          JUAN CAMILO ATEHORTUA ZULUAGA
 * @link            http://answercpi.com
 * @version         Current v1.0.0 
 * @copyright       Copyright (c) 2010 - 2016 answercpi.com
 * @license         Comercial
 * @since           06/10/2016
 */
'use strict';

$(document).ready(function () {
    cargarGrafica();
});

var cargarGrafica = function() {       
    var json = JSON.parse(DATA_JSON);
    update(json);
};

var update = function(data) {    
    var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 80},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;
  
    var tooltip = d3.select("body").append("div").attr("class", "toolTip");
    
    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleBand().range([height, 0]).padding(0.1);
    var z = d3.scaleSequential(d3.interpolateReds);

    var g = svg.append("g")
        .attr("transform", "translate(" + (margin.left + 100) + "," + margin.top + ")");
    
    data.sort(function(a, b) { return a.value - b.value; });
  
    x.domain([0, d3.max(data, function(d) { return d.value; })]);
    y.domain(data.map(function(d) { return puntosSuspensivos(d); }));
    z.domain([0, d3.max(data, function(d) { return d.value; }) * 12]);

    g.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y));

    var bars = g.selectAll(".bar")
            .data(data)
            .enter();

    bars.append("rect")
        .attr("class", "bar")
        .attr("x", 0)
        .style("fill", function(d) { return z(d.value); })
        .attr("height", y.bandwidth())
        .attr("y", function(d) { return y(puntosSuspensivos(d)); })
        .attr("width", function(d) { return d.value * 10 + "px"; })
        .on("mousemove", function(d){
            tooltip
              .style("left", d3.event.pageX - 50 + "px")
              .style("top", d3.event.pageY - 70 + "px")
              .style("display", "inline-block")
              .html((d.area) + "<br>" + (d.value));
        })
    		.on("mouseout", function(d){ tooltip.style("display", "none");});
        
    bars.append("text")
      .text(function(d){ return d.value;})
      .attr("fill", "black")
      .attr("x", function(d) { return (d.value * 10) - 20;})
      .attr("y", function(d) { return y(puntosSuspensivos(d)) + 20; });

};

var puntosSuspensivos = function(d) {
    return (d.area.length > 24) ? (d.area.substr(0, 24) + '...').toString() : d.area;
}