/**
 * Javascript que permite gestionar GRAFICA NIVEL RIESGO
 *
 * @package         SAR
 * @subpackage      SGSST
 * @category        Jasvascript
 * @author          Answecpi.com 
 * @author          JUAN CAMILO ATEHORTUA ZULUAGA
 * @author          ANDERSON DANILO BETANCOURT
 * @author          JUAN CARLOS GUTIERREZ MARTINEZ
 * @link            http://answercpi.com
 * @version         Current v1.0.0 
 * @copyright       Copyright (c) 2010 - 2016 answercpi.com
 * @license         Comercial
 * @since           05/10/2016
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
    margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;
    
    var color = d3.scaleSequential(d3.interpolateReds);

    var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
        y = d3.scaleLinear().rangeRound([height, 0]);

    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    x.domain(data.map(function(d) { return d.nivel; }));
    y.domain([0, d3.max(data, function(d) { return d.value[0]; })]);
    color.domain([0, 4]);

    g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
    .append("text")
        .attr("fill", "black")
        .text("Nivel de riesgo")
        .attr("text-anchor", "middle")
        .attr("x", (height/2) + 30)
        .attr("y", 30);

    g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y))
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("fill", "black")
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Número de peligros");
      
    var bars = g.selectAll(".bar")
            .data(data)
            .enter();
    
    // Define the div for the tooltip
    var div = d3.select("body").append("div")	
        .attr("class", "tooltip")				
        .style("opacity", 0);
    
    bars.append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.nivel); })
      .attr("y", function(d) { return y(d.value[0]); })
      .style("fill", function (d) {
        var nivelColor = 0;
        switch (d.nivel) {
            case "I": {
                nivelColor = 4;
            }
            break;
            case "II": {
                nivelColor = 3;
            }
            break;
            case "III": {
                nivelColor = 2;
            }
            break;
            case "IV": {
                nivelColor = 1;
            }
            break;
        }
        console.log(nivelColor);
        return color(nivelColor);
      })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - y(d.value[0]); })
      .on("mousemove", function(d) {		
        div.transition()		
            .duration(200)		
            .style("opacity", .9);		
        div.html(d.nivel + "<br/>"  + d.value[1])	
            .style("left", (d3.event.pageX) + "px")		
            .style("top", (d3.event.pageY - 28) + "px");	
        })					
      .on("mouseout", function(d) {		
            div.transition()		
                .duration(500)		
                .style("opacity", 0);	
        });;
      
    bars.append("text")
      .attr("class", "textAxisLeft")
      .text(function(d){ return d.value[0];})
      .attr("x", function(d) { return (x(d.nivel) + x.bandwidth()/2) - 4;})
      .attr("y", function(d) { return y(d.value[0]) - 5; });
};
