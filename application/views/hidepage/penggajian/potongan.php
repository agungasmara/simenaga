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
          <a href="<?=base_url("hideend/penggajian/add")?>" class="btn btn-primary btn-block margin-bottom">Add Gaji Individu</a>

              <div class="box box-solid">
                <div class="box-header with-border">
                  <h3 class="box-title">BPD</h3>

                  <div class="box-tools">
                    <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-minus"></i>
                    </button>
                  </div>
                </div>
                <div class="box-body no-padding">
                  <ul class="nav nav-pills nav-stacked">
                    <li :class="{ active: jenis_potongan === 'bpd_gianyar' }"><a href="#" @click.prevent="showPotongan('bpd_gianyar','BPD Gianyar')"><i class="fa fa-file-text-o"></i> BPD Gianyar</a></li>
                    <li :class="{ active: jenis_potongan === 'bpd_ubud' }"><a href="#" @click.prevent="showPotongan('bpd_ubud','BPD Ubud')"><i class="fa fa-file-text-o"></i> BPD Ubud</a></li>
                    <li :class="{ active: jenis_potongan === 'bpd_tampaksiring' }"><a href="#" @click.prevent="showPotongan('bpd_tampaksiring','BPD Tampak Siring')"><i class="fa fa-file-text-o"></i> BPD Tampak Siring</a></li>
                    <li :class="{ active: jenis_potongan === 'bpd_sukawati' }"><a href="#" @click.prevent="showPotongan('bpd_sukawati','BPD Sukawati')"><i class="fa fa-file-text-o"></i> BPD Sukawati</a></li>
                  </ul>
                </div>
                <!-- /.box-body -->
              </div>
              <div class="box box-solid collapsed-box">
                <div class="box-header with-border">
                  <h3 class="box-title">Pinjaman Koperasi</h3>

                  <div class="box-tools">
                    <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-plus"></i>
                    </button>
                  </div>
                </div>
                <div class="box-body no-padding">
                  <ul class="nav nav-pills nav-stacked">
                    <li :class="{ active: jenis_potongan === 'simpanan_kop_naker' }"><a href="#" @click.prevent="showPotongan('simpanan_kop_naker','Simpanan Koperasi Naker')"><i class="fa fa-file-text-o"></i> Simpanan Koperasi Naker</a></li>
                    <li :class="{ active: jenis_potongan === 'pinjaman_kop_naker' }"><a href="#" @click.prevent="showPotongan('pinjaman_kop_naker','Pinjaman Koperasi Naker')"><i class="fa fa-file-text-o"></i> Pinjaman Koperasi Naker</a></li>
                    <li :class="{ active: jenis_potongan === 'kop_sinar' }"><a href="#" @click.prevent="showPotongan('kop_sinar','Koperasi Sinar Wargi')"><i class="fa fa-file-text-o"></i> Koperasi Sinar Wargi</a></li>
                    <li :class="{ active: jenis_potongan === 'werdhi_sedana' }"><a href="#" @click.prevent="showPotongan('werdhi_sedana','Koperasi Werdi Sedana')"><i class="fa fa-file-text-o"></i> Koperasi Werdi Sedana</a></li>
                  </ul>
                </div>
                <!-- /.box-body -->
              </div>
              <div class="box box-solid collapsed-box">
                <div class="box-header with-border">
                  <h3 class="box-title">Potongan Lain</h3>

                  <div class="box-tools">
                    <button type="button" class="btn btn-box-tool" data-widget="collapse"><i class="fa fa-plus"></i>
                    </button>
                  </div>
                </div>
                <div class="box-body no-padding">
                  <ul class="nav nav-pills nav-stacked">
                    <li :class="{ active: jenis_potongan === 'cicilan_barang' }"><a href="#" @click.prevent="showPotongan('cicilan_barang','Cicilan Barang')"><i class="fa fa-file-text-o"></i> Cicilan Barang</a></li>
                    <li :class="{ active: jenis_potongan === 'santunan_meninggal' }"><a href="#" @click.prevent="showPotongan('santunan_meninggal','Santunan PNS Meninggal')"><i class="fa fa-file-text-o"></i> Santunan PNS Meninggal</a></li>
                  </ul>
                </div>
                <!-- /.box-body -->
              </div>
          </div>
        <!-- /.col -->
        <div class="col-md-9">
          <div class="box box-primary">
            <div class="box-header with-border">
              <h3 class="box-title btn btn-success">{{textJenis}}</h3>

            </div>
            <!-- /.box-header -->
            <div class="box-body no-padding">
              
              <div class="table-responsive mailbox-messages">
                <rekap-potongan 
                            ref="formRekapPotong" 
                            :jenispotongan="jenis_potongan"
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