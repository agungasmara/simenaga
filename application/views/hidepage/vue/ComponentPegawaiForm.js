<script type="text/x-template" id="pegawaiForm">
    <div>
    <div class="col-md-8">
                <div class="nav-tabs-custom">
                    <form-wizard :ref="'vuewizard'" :start-index.sync="stepIndex">
                        <wizard-step slot-scope="props" slot="step"  :tab="props.tab" :transition="props.transition" :index="props.index">
                        </wizard-step>
                        <h3 slot="title"></h3>
                        <tab-content icon="fa fa-money" :before-change="beforeTab1Switch">
                         <div class="box box-primary">
                                <div class="box-header with-border">
                                    <h3 class="box-title btn bg-maroon margin">IDENTITAS PEGAWAI</h3>
                                </div>
                                <div class="form-horizontal">
                                    <div class="box-body">

                                        <div class="form-group" >
                                            <label for="exampleInputEmail1" class="col-sm-2 control-label">Nama Pegawai</label>
                                            <div class="col-sm-8">
                                                <input type="text" class="form-control" placeholder="Nama" v-validate="'required'" name="nama_petugas" v-model="pegawai.nama" data-vv-scope="step1" :disabled="false" >
                                                <span class="text-red">{{ errors.first('step1.nama_petugas') }}</span>
                                            </div>
                                        </div>
                                        <div v-if="true">
                                            <div class="form-group">
                                                <label for="exampleInputEmail1" class="col-sm-2 control-label">Email Pegawai</label>
                                                <div class="col-sm-5">
                                                    <input type="text" class="form-control"  placeholder="Nomor Induk Pegawai" v-validate="'required'" name="email"  data-vv-scope="step1" v-model="pegawai.email" :disabled="false">
                                                    <span class="text-red">{{ errors.first('step1.email') }}</span>
                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <label for="exampleInputEmail1" class="col-sm-2 control-label">NIP Pegawai</label>
                                                <div class="col-sm-5">
                                                    <input type="text" class="form-control"  placeholder="Nomor Induk Pegawai" v-validate="'required'" name="nip_petugas"  data-vv-scope="step1" v-model="pegawai.nip" :disabled="false">
                                                    <span class="text-red">{{ errors.first('step1.nip_petugas') }}</span>
                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <label for="exampleInputEmail1" class="col-sm-2 control-label">Golongan</label>
                                                <div class="col-sm-5">
                                                    <input type="jabatan" class="form-control"  placeholder="Jabatan Petugas" v-validate="'required'" name="golongan" v-model="pegawai.golongan" data-vv-scope="step1" :disabled="false">
                                                    <span class="text-red">{{ errors.first('step1.golongan') }}</span>
                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <label for="exampleInputEmail1" class="col-sm-2 control-label">Jabatan</label>
                                                <div class="col-sm-5">
                                                    <input type="jabatan" class="form-control"  placeholder="Jabatan Petugas" v-validate="'required'" name="jabatan_petugas" v-model="pegawai.jabatan" data-vv-scope="step1" :disabled="false">
                                                    <span class="text-red">{{ errors.first('step1.jabatan_petugas') }}</span>
                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <label for="exampleInputEmail1" class="col-sm-2 control-label">Gaji Pokok</label>
                                                <div class="col-sm-5">
                                                     <money  type="text" v-bind="money" class="form-control" v-validate="'required|numeric'" name="gaji_pokok" v-model="pegawai.gaji_pokok" placeholder="" data-vv-scope="step1" :disabled="false"> </money>
                                                    <span class="text-red">{{ errors.first('step1.gaji_pokok') }}</span>
                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <label for="exampleInputEmail1" class="col-sm-2 control-label">Tunjangan Kesejahteraan</label>
                                                <div class="col-sm-5">
                                                     <money  type="text" v-bind="money" class="form-control" v-validate="'required|numeric'" name="tunjangan_jabatan" v-model="pegawai.tunjangan_jabatan" placeholder="" data-vv-scope="step1" :disabled="false"> </money>
                                                    <span class="text-red">{{ errors.first('step1.tunjangan_jabatan') }}</span>
                                                </div>
                                            </div>
                                        

                                        </div>
                                    </div>
                                    <!-- /.box-body -->

                                </div>




                            </div>
                        </tab-content>


                           

                        <template slot="footer" slot-scope="props">
                            <div class="wizard-footer-right2">

                                <wizard-button v-if="!isEditForm" @click.native="finishPegawai();isSaveNext=1" class="wizard-footer-right finish-button" :style="props.fillButtonStyle">Save & Next Pegawai</wizard-button>
                                <wizard-button @click.native="finishPegawai();isSaveNext=0" class="wizard-footer-right finish-button" :style="props.fillButtonStyle" style="margin-right: 10px;">Save Data</wizard-button>
                                <wizard-button @click.native="backtoTable()" class="btn btn-success" :style="styleback">Back</wizard-button>
                            </div>  
                        </template>
                    </form-wizard>
                </div>
    </div>
    <div class="col-md-4">
        <div class="box box-default">
   
                <div v-if="stepIndex=='0'">
                    <div class="box-header with-border">
                        <i class="fa fa-bullhorn"></i>

                        <h3 class="box-title">Pengumuman!</h3>
                    </div>
                    <div class="box-body">
                        <div class="callout callout-danger">
                            <h4>INPUT GAJI PETUGAS</h4>

                            <p>Mohon diisi data petugas yang melaksanakan inputing pegawai secara lengkap. </p>
                        </div>
                    </div>
                </div>     
                <div v-else-if="stepIndex=='1'">
                    <div class="box-header with-border">
                        <i class="fa fa-bullhorn"></i>

                        <h3 class="box-title">Pengumuman!</h3>
                    </div>
                    <div class="box-body">
                        <div class="callout callout-danger">
                            <h4>Penting diingat!</h4>

                            <p>Mohon untuk memastikan Tujuan Surat dalam Surat Permohonan, apakah sudah sesuai dengan informasi di sebalah berikut.</p>
                        </div> 
                    </div>
                </div>        
                <div v-else-if="stepIndex=='2'">
                    <div class="box-header with-border">
                        <i class="fa fa-bullhorn"></i>

                        <h3 class="box-title">Pengumuman!</h3>
                    </div>
                    <div class="box-body">
                        <div class="callout callout-danger">
                            <h4>JABATAN PEMOHON</h4>

                            <p>Ketikkan Jabatan Pemohon secara lengkap, Contoh: Kepala Kantor Pertanahan Maluku Tengah, Sekretaris Jenderal Kementerian Agama, dll.</p>
                        </div>
                        <div class="callout callout-info">
                            <h4>UPLOAD SURAT PERMOHONAN </h4>

                            <p>Upload File Surat Permohonan dalam format PDF atau JPEG. (Max 2 MB) </p>
                        </div>
                        <div class="callout callout-warning">
                            <h4>UPLOAD DAFTAR RINCIAN BMN</h4>

                            <p>Upload File Daftar Rincian BMN dalam format XLS. File ini sangat membantu kami dalam memverifikasi berkas permohonan. Untuk format XLS dapat di download pada tombol yang tersedia.  (Max 2 MB)</p>
                        </div> 
                        <div class="callout callout-info">
                            <h4>UPLOAD DOKUMEN KELENGKAPAN</h4>

                            <p>Upload File Dokumen Kelengkapan Permohonan PSP dalam format PDF atau JPEG  (Max 2 MB). Dokumen Kelengkapan antara lain:</p>
                            <ol>
                                <li>
                                    Untuk BMN yang Memiliki Dokumen Kepemilikan, lampirkan:
                                    <ul>
                                        <li>Fotokopi Dokumen Kepemilikan, dan</li>
                                        <li>Surat keterangan pejabat struktural menyatakan kebenaran fotokopi tersebut</li>
                                    </ul>
                                </li>
                                <li>
                                    Untuk BMN yang tidak mempunyai Dokumen Kepemilikan (Selain Tanah dan Bangunan diatas Rp. 100 Juta), lampirkan:
                                    <ul>
                                        <li>Fotokopi  BAST perolehan barang dan dokumen lainnya, dan</li>
                                        <li>Surat keterangan pejabat struktural menyatakan kebenaran fotokopi tersebut</li>
                                    </ul>
                                </li>
                                <li>
                                    Untuk BMN yang tidak mempunyai Dokumen Kepemilikan, lampirkan:
                                    <ul>
                                        <li>SPTJ bermaterai bahwa barang tersebut adalah BMN dan digunakan untuk tugas dan fungsi</li>
                                        <li>Surat Kehilangan dari Kepolisian apabila Memiliki Dokumen Kepemilikan namun Hilang.</li>
                                    </ul>
                                </li>
                                <li>
                                    KIB
                                </li>
                                <li>
                                    Foto
                                </li>
                                <li>
                                    Fotocopy Surat Keputusan (dari Kementerian/Lembaga) tentang Pendelegasian Wewenang
                                </li>
                            </ol>
                        </div> 
                    </div>
                </div>        
                <div v-else-if="stepIndex=='3'">
                    <div class="box-header with-border">
                        <i class="fa fa-bullhorn"></i>

                        <h3 class="box-title">Pengumuman!</h3>
                    </div>
                    <div class="box-body">
                        <div class="callout callout-danger">
                            <h4>Terima Kasih!</h4>

                            <p>Terima kasih sudah menginput data PSP BMN</p>
                        </div>
                    </div>
                </div>   
                    
                </div>
    </div>
  </div>
</script>
