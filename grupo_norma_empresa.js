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
$(document).ready(function () {
    dataPieChart();
});

function dataPieChart() {    
    if(datas) {
        var datasPie = '{"header":{"title":{"text":"Grupo norma","fontSize":24,"font":"open sans"},"subtitle":{"text":"Muestra el porcentaje del numero de normas utilizadas en un grupo","color":"#999999","fontSize":12,"font":"open sans"},"titleSubtitlePadding":9},"footer":{"color":"#999999","fontSize":10,"font":"open sans","location":"bottom-left"},"size":{"canvasWidth":750,"pieInnerRadius":"70%","pieOuterRadius":"100%"},"data":{"sortOrder":"value-desc","smallSegmentGrouping":{"enabled":true,"value":2,"label":"Otros grupos"},"content":';
        datasPie += datas;
        datasPie += '},"labels":{"outer":{"pieDistance":32},"inner":{"hideWhenLessThanPercentage":3},"mainLabel":{"fontSize":11},"percentage":{"color":"#ffffff","decimalPlaces":0},"value":{"color":"#adadad","fontSize":11},"lines":{"enabled":true},"truncation":{"enabled":true}},"tooltips":{"enabled":true,"type":"placeholder","string":"{label}: {value}, {percentage}%"},"effects":{"pullOutSegmentOnClick":{"effect":"linear","speed":400,"size":8}},"misc":{"gradient":{"enabled":true,"percentage":100}}}';

        datasPieParse = jQuery.parseJSON(datasPie);

        console.log(datasPieParse);

        $.each(datasPieParse.data.content, function(i, item) {
            item['color'] = get_color_aleatorio(true);   
            item['value'] = parseInt(item['value']);
        });    

        var pie = new d3pie("pieChart", datasPieParse);
    }
}
