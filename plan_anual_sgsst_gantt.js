/**
 * Javascript que permite gestionar GRAFICA GRUPO NORMA EMPRESA  SGSST
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
 * @since           12/05/2016
 */
var g;

$(document).ready(function () {
    if(typeof urlGetDatosGraficaPlanAnualGantt != 'undefined') {
        inicializarSelect();        
        eventChangePlan();
    }    
});

var inicializarSelect = function (){    
    id_plan_anual_sgsst = '';
    $('#id_plan_anual_sgsst').val('');
    $('#id_plan_anual_sgsst').select2({
        placeholder: "Seleccione",
        allowClear: true
    });
    $('#id_plan_anual_sgsst').data('option', '');
    $('#id_plan_anual_sgsst').change();//Obligo el change
};

var eventChangePlan = function(){
    $(document).on('change', '#id_plan_anual_sgsst', function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        cargarDatos();        
    });
};

var cargarDatos = function() {
    var data_gantt;
    var data_plan = {
        id_plan_anual_sgsst: $('#id_plan_anual_sgsst').val()
    };
    $.ajax({
        url: urlGetDatosGraficaPlanAnualGantt,
        data: data_plan,
        type: 'POST',
        success: function(respuesta) {
            data_temp = [];
            data_temp = jQuery.parseJSON(respuesta); 
            
            data_gantt = mezclarDatos(data_temp);              

            ganttChart(data_gantt);
        }
    });     
};

var mezclarDatos = function(data_temp) {
    var arrayList = [];
    $.each(data_temp, function(i, item) {        
        $.each(arrayList, function(i, item2) {   
            if(item2){
                if (item.pID === item2.pID) {
                    item.pRes += ", " + item2.pRes;
                    delete arrayList[i];
                    return false;
                }
            }            
        });                         
        arrayList.push(item);
    });
    
    return arrayList;
};

var ganttChart = function(data_gantt) {  
    // here's all the html code neccessary to display the chart object
    // Future idea would be to allow XML file name to be passed in and chart tasks built from file.
    g = new JSGantt.GanttChart(document.getElementById('GanttChartDIV'), 'month');
    
    g.addLang('es', {
        'jan':'Ene', 
        'apr':'Abr',
        'aug':'Ago',
        'january':'Enero',
        'february': 'Febrero',
        'march':'Marzo',
        'april':'Abril',
        'maylong':'Mayo',
        'june':'Junio',
        'july':'Julio',
        'august':'Agosto',
        'september':'Septiembre',
        'october':'Octubre',
        'november':'Noviembre',
        'december':'Diciembre',
        'day':'Día',
        'week':'Semana',
        'month':'Mes',
        'quarter':'Cuatrimestre',
        'resource':'Recurso',
        'duration':'Duración',
        'startdate':'Fecha inicio',
        'enddate':'Fecha final',
        'days':'días',
        'moreinfo': 'Más información',
        'completion':'Porcentaje',
        'sun':'Dom',
        'mon':'Lun',
        'tue':'Mar',
        'wed':'Mie',
        'thu':'Jue',
        'fri':'Vie',
        'sat':'Sab',        
        'notes':'Observaciones',
        'format':'Formato',
        'dy':'Día',
        'wk':'Sem',
        'mth':'Mes',
        'dys':'Días',
        'wks':'Sem', 
        'mths':'Meses'
    });
    
    g.setCaptionType('Complete');  // Set to Show Caption (None,Caption,Resource,Duration,Complete)
    g.setQuarterColWidth(36);
    g.setDateTaskDisplayFormat('day dd month yyyy'); // Shown in tool tip box
    g.setDayMajorDateDisplayFormat('mon yyyy - Week ww'); // Set format to display dates in the "Major" header of the "Day" view
    g.setWeekMinorDateDisplayFormat('dd mon'); // Set format to display dates in the "Minor" header of the "Week" view
    g.setShowTaskInfoLink(1); //Show link in tool tip (0/1)
    g.setShowEndWeekDate(0); // Show/Hide the date for the last day of the week in header for daily view (1/0)
    g.setUseSingleCell(10000); // Set the threshold at which we will only use one cell per table row (0 disables).  Helps with rendering performance for large charts.
    g.setFormatArr('Day', 'Week', 'Month', 'Quarter'); // Even with setUseSingleCell using Hour format on such a large chart can cause issues in some browsers
    g.setLang('es');
    
    if(g) {
        var r = convert(data_gantt);
        recorrerJson(r);

        g.Draw();	
    }
    else
    {
      console.log("not defined");
    }
};

var timeSpamToDate = function(unix_timestamp){
    // Create a new JavaScript Date object based on the timestamp
    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
    var d = new Date(unix_timestamp*1000);
    var formattedTime = d.getFullYear() + '-' + ('0' + (d.getMonth()+1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
    
    return formattedTime;
};

var convert = function(data_gantt) {
    var map = {};
    console.log(data_gantt);
    $.each(data_gantt, function(i, obj) {
        if(obj){
            obj.items= [];

            map[obj.pID] = obj;

            var parent = obj.pParent == 0 ? '-' : obj.pParent;
            if(!map[parent]){
                map[parent] = {
                    items: []
                };
            }
            map[parent].items.push(obj);
        }
    });

    return map['-'].items;
};

var recorrerJson = function(r){
    // Parameters                     (pID, pName,                  pStart,       pEnd,        pStyle,         pLink (unused)  pMile, pRes,       pComp, pGroup, pParent, pOpen, pDepend, pCaption, pNotes, pGantt)
    // You can also use the XML file parser JSGantt.parseXML('project.xml',g)  
    $.each(r, function(i, item) {
        if(item) {
            item['pID'] = parseInt(item['pID']);
            item['pParent'] = parseInt(item['pParent']);
            item['pGroup'] = parseInt(item['pGroup']);               
            item['cantidad_cumplida'] = (item['cantidad_cumplida']) ?  parseInt(item['cantidad_cumplida']) : 0;
            item['cantidad_actividad'] = parseInt(item['cantidad_actividad']);
            item['pComp'] = (item['cantidad_cumplida'] > 0) ? (item['cantidad_cumplida'] / item['cantidad_actividad']) * 100 : 0;
            item['pMile'] = item['pComp'] == 100 ? 1 : 0;
            item['pColor'] = getAleatorioClassColor(item['pGroup'] == 1 ? true : false);
            item['pStart'] = item['pStart'] == '0' ? '' : timeSpamToDate(item['pStart']);
            item['pEnd'] = item['pEnd'] == '0' ? '' : timeSpamToDate(item['pEnd']);          

            g.AddTaskItem(new JSGantt.TaskItem(item['pID'], item['pName'], item['pStart'], item['pEnd'], item['pColor'], '', 0, item['pRes'], item['pComp'].toFixed(2), item['pGroup'], item['pParent'], 1, '', '', item['pNotes'], g));

            if(item.items.length > 0){
                recorrerJson(item.items);
            }
        }
    });
};

var getAleatorioClassColor = function(isGggroupblack){
    if(isGggroupblack){
        return 'ggroupblack';
    } else {  
        return 'gtaskblue';
    }
};
