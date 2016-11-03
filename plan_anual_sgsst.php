<?php echo $this->session->flashdata('mensaje') //Imprimimos los errores de tipo flash si existen ya vienencon todo el diseño                          ?>
<?php add_js(RUTAPLUGIND3TIP);  ?>
<div class="widget widget-heading-simple widget-body-white">
    <div class="widget-body">
        <!-- Row -->
        <div class="row">
            <!-- Column -->
            <div class="col-md-12">
                <h4 class="text-primary"><?php echo $this->titulo_controlador ?></h4>
                <hr class="separator" />
                <div class="panel-group accordion accordion-2" id="tabAccountAccordion">

                    <!-- Accordion Item Titulo-->
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            <h4 class="panel-title"><a class="accordion-toggle glyphicons right_arrow " data-toggle="collapse" data-parent="#tabAccountAccordion" href="#collapse-1-1"><i></i>Formulario</a></h4>
                        </div>
                        <div id="collapse-1-1" class="panel-collapse collapse in">
                            <div class="form-horizontal margin-bottom-none form_principal">
                                <div class=" widget-body-white widget-body-white">
                                    <div class="widget-body">
                                        <!-- Row -->
                                        <div class="row">
                                            <!-- Column -->
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label class="col-md-4 control-label">Tipo plan anual<span class="required">*</span></label>
                                                    <div class="col-md-8"><?php echo form_dropdown('id_plan_anual_sgsst', $this->Plan_anual_sgsst_model->getArrayPlan('plan_anual_sgsst'), set_value('id_plan_anual_sgsst', ''), 'style="width: 100%;" class="selectanswer" id="id_plan_anual_sgsst" required') ?></div>
                                                </div>

                                                <div class="form-group">
                                                    <label class="col-md-4 control-label">Objetivo general<span class="required">*</span></label>
                                                    <div class="col-md-8"><?php echo form_dropdown('id_actividad_plan_anual_general', '', set_value('id_actividad_plan_anual_general', ''), 'style="width: 100%;" class="selectanswer" id="id_actividad_plan_anual_general" disabled required') ?></div>
                                                </div>

                                                <div class="form-group">
                                                    <label class="col-md-4 control-label">Objetivo específico<span class="required">*</span></label>
                                                    <div class="col-md-8"><?php echo form_dropdown('id_actividad_plan_anual_especifico', '', set_value('id_actividad_plan_anual_especifico', ''), 'style="width: 100%;" class="selectanswer" id="id_actividad_plan_anual_especifico" disabled required') ?></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <hr class="clear" />
                    <div class="table-responsive">
                        <div id="grafica_dual_scale" style="margin-left: -45px;">

                        </div>
                        <table id="tabla_descripcion" style="margin-left: -45px;display: none;padding: 0px 90px 10px;" class="table table-primary table-striped">
                            <thead>
                                <tr>
                                    <th style="width: 1%;" class="center">No. Punto</th>
                                    <th>Descripcion</th>
                                </tr>
                            </thead>
                            <tbody id="x_option">

                            </tbody>
                        </table>
                    </div>
                </div>                 
            </div>
        </div>
    </div>
</div>
<script type="text/javascript">
    var urlActividadPLanAnual = '<?php echo base_url() . RUTACLIENTSGSST ?>actividad_plan_anual/actividad_plan_sgsst';
    var urlGetDatosGraficaPlanAnual = '<?php echo base_url() . RUTACLIENTSGSST ?>plan_anual_sgsst/getDatosGraficaPlanAnual';
</script>

