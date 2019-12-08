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

        <!-- Main content -->
    <section class="content">
      <div class="row">
        <div class="col-md-3">
          <a href="<?=base_url("hideend/penggajian/add")?>" class="btn btn-primary btn-block margin-bottom">Add Gaji</a>

          <div class="box box-solid">
            <div class="box-header with-border">
              <h3 class="box-title">Category</h3>

              <div class="box-tools">
                <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i>
                </button>
              </div>
            </div>
            <div class="box-body no-padding">
              <ul class="nav nav-pills nav-stacked">
                <li class="active"><a href="#"  @click.prevent="getRekapbyJenis()"><i class="fa fa-inbox"></i> All</a></li>
                <li><a href="#" @click.prevent="getRekapbyJenis(1)"><i class="fa fa-file-text-o"></i> Bulanan</a></li>
                <li><a href="#" @click.prevent="getRekapbyJenis(2)"><i class="fa fa-file-text-o"></i> Tunjangan Kesra</a></li>
                <li><a href="#" @click.prevent="getRekapbyJenis(3)"><i class="fa fa-file-text-o"></i> Gaji 13</a></li>
                <li><a href="#" @click.prevent="getRekapbyJenis(4)"><i class="fa fa-file-text-o"></i> Tunjangan Kesra 13</a></li>
                <li><a href="#" @click.prevent="getRekapbyJenis(5)"><i class="fa fa-file-text-o"></i> THR</a></li>
              </ul>
            </div>
            <!-- /.box-body -->
          </div>
          </div>
        <!-- /.col -->
        <div class="col-md-9">
          <div class="box box-primary">
            <div class="box-header with-border">
              <h3 class="box-title">Tabel Gaji</h3>

            </div>
            <!-- /.box-header -->
            <div class="box-body no-padding">
              
              <div class="table-responsive mailbox-messages">
                <table-rekapgaji 
                            ref="tableRekapPenggajian" 
                            v-on:send-data="getDatachoosePenggajian"
                            v-on:send-jenisform="getJenisForm"
                        />   
                <!-- /.table -->
              </div>
              <!-- /.mail-box-messages -->
            </div>
            <!-- /.box-body -->
            <div class="box-footer no-padding">
              
            </div>
          </div>
          <!-- /. box -->
        </div>
        <!-- /.col -->
      </div>
      <!-- /.row -->
    </section>

</div>
<!-- /.content-wrapper -->