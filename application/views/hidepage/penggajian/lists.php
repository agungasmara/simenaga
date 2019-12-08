<!-- Content Wrapper. Contains page content -->
<div class="content-wrapper" id="app">

    <!-- Content Header (Page header) -->
    <section class="content-header">
        <h1>
            Dashboard

            <small>Control panel</small>
        </h1>
        <ol class="breadcrumb">
            <li>
                <a href="#">
                    <i class="fa fa-dashboard"></i> Home
                </a>
            </li>
            <li class="active">Dashboard</li>
        </ol>
    </section>
    <!-- Main content -->
    <section class="content" id="tableVerifikasi" v-if="showPenggajianTable">
        <!-- /.row -->
        <!-- Main row -->
        <div class="row">
            <!-- Left col -->
            <section class="col-lg-12">
                <!-- Custom tabs (Charts with tabs)-->
                <div class="nav-tabs-custom">
                    <!-- Tabs within a box -->
                    <!-- quick email widget -->
                    <div class="box box-info">
                        <div class="box-header">
                            <div class="col-xs-4">
                                <h3 class="box-title">Rekap Seluruh Gaji</h3>
                            </div>
                            <div class="col-xs-6">
                                
                            </div>
                            <div class="col-xs-1">
                                <div class="pull-right">
                                    <a href="<?php echo site_url("/hideend/penggajian/") ?>" class="btn btn-primary">
                                        Add Penggajian Individu
                                    </a>
                                </div>
                            </div>                            
                            <div class="col-xs-1" style="padding-right:5px;">
                                <div class="pull-right">
                                    <a href="#" @click.prevent="sendEmailGaji()" class="btn btn-primary">
                                        Send All Email
                                    </a>
                                </div>
                            </div>
                        </div>
                        
                        <table-penggajian 
                            ref="tablePenggajian"
                            @send-data="getDatachoosePenggajian"
                            @send-jenisform="getJenisForm"
                        />   
                        <!-- /.box-header -->
                        
                        
                        
                        <!-- /.box-body -->

                    </div>
                    <!-- /.box -->
                </div>
            </section>
            <!-- /.Left col -->
            <!-- right col (We are only adding the ID to make the widgets sortable)-->
        </div>
        <!-- /.row (main row) -->

    </section>
    <!-- /.content -->
    <section class="content" id="formWizardVerifikasi" v-if="showPenggajianDetail">

        <div class="row">
                <!-- Custom Tabs -->
                <detail-penggajian 
                        :datapenggajian="choosePenggajian"                        
                        v-on:send-data="finishProsesVerifikasi"
                        v-on:back-data="backtoTable"
                        > 
                </detail-penggajian>

                <!-- /.tab-content -->
            

        </div>
        <!-- /.col -->
    </section>

</div>
<!-- /.content-wrapper -->