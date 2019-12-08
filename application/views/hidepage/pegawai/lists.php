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
    <section class="content" id="tableVerifikasi" v-if="showPegawaiTable">
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
                            <div class="col-xs-7">
                                
                            </div>
                            <div class="col-xs-1">
                                <div class="pull-right">
                                    <a href="<?php echo site_url("/hideend/pegawai/add") ?>" class="btn btn-primary">
                                        Add Pegawai
                                    </a>
                                </div>
                            </div>
                        </div>
                        
                        <table-pegawai 
                            ref="'tablePegawai'" 
                            v-on:send-data="getDatachoosePegawai"
                            v-on:send-jenisform="getJenisForm"
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
    <section class="content" id="formWizardVerifikasi" v-if="showPegawaiDetail">

        <div class="row">
                <!-- Custom Tabs -->
                <detail-pegawai 
                        :datapegawai="choosePegawai"                        
                        v-on:send-data="finishProsesVerifikasi"
                        v-on:back-data="backtoTable"
                        > 
                </detail-pegawai>

                <!-- /.tab-content -->
            

        </div>
        <!-- /.col -->
    </section>

</div>
<!-- /.content-wrapper -->