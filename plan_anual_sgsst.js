/**
 * Javascript que permite gestionar GRAFICA PLAN ANUAL SGSST en el sistema
 *
 * @package         SAR
 * @subpackage      Administracion
 * @category        Jasvascript
 * @author          Answecpi.com 
 * @author          JUAN CAMILO ATEHORTUA ZULUAGA
 * @link            http://answercpi.com
 * @version         Current v1.0.0 
 * @copyright       Copyright (c) 2010 - 2015 answercpi.com
 * @license         Comercial
 * @since           12/05/2016
 */
var data_grafica;

$(document).ready(function () {  
    if(typeof urlGetDatosGraficaPlanAnual != 'undefined') {
        inicializarSelect();        
        eventChangePlan();
        eventChangeActividadPlanAnualGeneral();
        eventChangeActividadPlanAnualEspecifico();
    }    
});

var inicializarSelect = function (){    
    id_plan_anual_sgsst = '';
    id_actividad_plan_anual_general = '';
    id_actividad_plan_anual_especifico = '';
    $('#id_plan_anual_sgsst, #id_actividad_plan_anual_general, #id_actividad_plan_anual_especifico').val('');
    $('#id_plan_anual_sgsst, #id_actividad_plan_anual_general, #id_actividad_plan_anual_especifico').select2({
        placeholder: "Seleccione",
        allowClear: true
    });
    $('#id_plan_anual_sgsst, #id_actividad_plan_anual_general, #id_actividad_plan_anual_especifico').data('option', '');
    $('#id_plan_anual_sgsst, #id_actividad_plan_anual_general, #id_actividad_plan_anual_especifico').change();//Obligo el change
};

var eventChangePlan = function(){
    $(document).on('change', '#id_plan_anual_sgsst', function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        actividad_plan_anual_general();
        borrarGrafica();
    });
};

var eventChangeActividadPlanAnualGeneral = function() {
    $(document).on('change', '#id_actividad_plan_anual_general', function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        actividad_plan_anual_especifico();
        borrarGrafica();
    });
};

var eventChangeActividadPlanAnualEspecifico = function() {
    $(document).on('change', '#id_actividad_plan_anual_especifico', function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        if($('#id_actividad_plan_anual_especifico').val() != 0 && $('#id_actividad_plan_anual_especifico').val() != ''){
            cargarDatos();
        } else {
            borrarGrafica();
        }        
    });
};

var actividad_plan_anual_general = function() {
    var dataJson = {
        id_plan_anual_sgsst: $('#id_plan_anual_sgsst').val()
    };
    selectAnidado(urlActividadPLanAnual, dataJson, $('#id_actividad_plan_anual_general'), id_actividad_plan_anual_general);
};

var actividad_plan_anual_especifico = function() {
    var dataJson = {
        id_actividad_plan_anual: $('#id_actividad_plan_anual_general').val(),
        id_plan_anual_sgsst: $('#id_plan_anual_sgsst').val()
    };
    selectAnidado(urlActividadPLanAnual, dataJson, $('#id_actividad_plan_anual_especifico'), id_actividad_plan_anual_especifico);
};

function cargarDatos() {
    var data_plan = {
        id_plan_anual_sgsst: $('#id_plan_anual_sgsst').val(),
        id_actividad_plan_anual: $('#id_actividad_plan_anual_especifico').val()
    };
    $.ajax({
        url: urlGetDatosGraficaPlanAnual,
        data: data_plan,
        type: 'POST',
        success: function(respuesta) {
            
            data_grafica = [];
            data_grafica = jQuery.parseJSON(respuesta);
            
            graficarDobleEscala();
            
            /*Pintar la tabla*/
            $("#x_option").html('');
            jQuery.each(data_grafica, function(i, val) {
                var item = '<tr><td class="center">' + val.actividad + '</td>' +
                        '<td><h5>' + val.descripcion + '</h5></td></tr>';
                
                $("#x_option").append(item);
            });
            $('#tabla_descripcion').css('display','block');
        }
    });    
}

var borrarGrafica = function() {
    d3.selectAll("#grafica_dual_scale > *").remove();
    $("#x_option").html('');
    $('#tabla_descripcion').css('display','none');
};

function graficarDobleEscala() {
    d3.selectAll("#grafica_dual_scale > *").remove();
    
    var margin = {top: 80, right: 80, bottom: 80, left: 80},
    width = 1300 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
    
    var x = d3.scale.ordinal().rangeRoundBands([0, width], .1);
    var y0 = d3.scale.linear().domain([300, 1100]).range([height, 0]);

    var xAxis = d3.svg.axis().scale(x).orient("bottom");
    
    // create left yAxis
    var yAxisLeft = d3.svg.axis().scale(y0).ticks(4).orient("left");
    // create right yAxis
    var yAxisRight = d3.svg.axis().scale(y0).ticks(4).orient("right");
    
    var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return "<strong>Actividad:</strong> <span style='color:white'>" + d.descripcion + "</span>";
    });
    
    var svg = d3.select("#grafica_dual_scale").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("class", "graph")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.call(tip);

    //Carga de data_grafica
      x.domain(data_grafica.map(function(d) { return d.actividad; }));
      y0.domain([0, d3.max(data_grafica, function(d) { return d.cantidadActividad > 6 ? d.cantidadActividad : 6; })]);

      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", function () {
              return "translate(0," + height + ")"; })
          .call(xAxis);
  
      svg.append("g")
              .attr("class", "y axis axisLeft")
              .attr("transform", "translate(0,0)")
              .call(yAxisLeft)
            .append("text")
              .attr("y", 6)
              .attr("dy", "-3em");
              //.text("Actividad planeada");

      svg.append("g")
              .attr("class", "y axis axisRight")
              .attr("transform", "translate(" + (width) + ",0)")
              .call(yAxisRight)
            .append("text")
              .attr("y", 6)
              .attr("dy", "-3em")
              .attr("dx", "2em")
              .style("text-anchor", "end");
              //.text("Actividad ejecutada");        
      
      bars = svg.selectAll(".bar").data(data_grafica).enter();
      bars.append("rect")
          .attr("class", "bar1")
          .attr("x", function(d) { return x(d.actividad); })
          .attr("width", x.rangeBand()/2)
          .attr("y", function(d) { return y0(d.cantidadActividad); })
          .attr("height", function(d,i,j) { return height - y0(d.cantidadActividad); })
          .on('mouseover', tip.show)
          .on('mouseout', tip.hide); 
  
      bars.append("rect")
          .attr("class", "bar2")
          .attr("x", function(d) { return x(d.actividad) + x.rangeBand()/2; })
          .attr("width", x.rangeBand() / 2)
          .attr("y", function(d) { return y0(d.cantidadCumplida); })
          .attr("height", function(d,i,j) { return height - y0(d.cantidadCumplida); })
          .on('mouseover', tip.show)
          .on('mouseout', tip.hide);
      
      bars.append("text")
            .attr("class", "textAxisLeft")
            .text(function(d){
                return d.cantidadActividad ? d.cantidadActividad : 0;
            })
            .attr("x", function(d) { return (x(d.actividad) + x.rangeBand()/4) - 4; })
            .attr("y", function(d) { return y0(d.cantidadActividad) - 5; });
    
      bars.append("text")
            .attr("class", "textAxisRight")
            .text(function(d){
                return d.cantidadCumplida ? d.cantidadCumplida : 0;
            })
            .attr("x", function(d) { return (x(d.actividad) + ((x.rangeBand())/1.5)); })
            .attr("y", function(d) { return y0(d.cantidadCumplida) - 5; });
    
    var color = d3.scale.ordinal().range(["#4682b4", "#6F8745"]);
    var ageNames = ["Actividad ejecutada","Actividad planeada"];
    
    var legend = svg.selectAll(".legend")
        .data(ageNames.slice().reverse())
      .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width - 18)
        .attr("y", -46)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("y", 6)
        .attr("dy", "-3em")
        .attr("dx", ".35em")
        .attr("x", width - 24)
        .style("text-anchor", "end")
        .text(function(d) { return d; });

}