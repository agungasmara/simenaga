


<script type="text/x-template" id="formRekapPotongan">
                <div class="box">          
                            <div class="box-header">


                  <div class="box-tools">
                
              </div>
            </div> 
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="exampleInputEmail1">Select Periode</label>
                            <vuejs-datepicker :format="customFormatter" :minimum-view="'month'" input-class="form-control clearFormInput" :value="new Date()" v-model="potongan.periode_gaji" name="periode_gaji"></vuejs-datepicker>
                            <span class="text-red">{{ errors.first('step1.periode_gaji') }}</span>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="exampleInputEmail1">Potongan ke Pendapatan</label>
                                <vue-multiselect 
                                    :allow-empty="false"
                                    v-model="jenis_gaji_obj" 
                                    :options="option_jenis_gaji" 
                                    :custom-label="jenis_gaji_fn" 
                                    placeholder="Select one" 
                                    track-by="nama" 
                                    v-validate data-vv-rules="required" 
                                    name="jenis_gaji"
                                    @input="set_jenis_gaji();">
                                </vue-multiselect>
                            <span class="text-red">{{ errors.first('step1.periode_gaji') }}</span>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                                <label for="exampleInputEmail1">Nama Pegawai</label>
                                <div>
                                    <vue-multiselect 
                                        ref="namaPegawai"
                                        :allow-empty="false"
                                        v-model="potongan.detailpegawai" 
                                        :options="option_detail_pegawai" 
                                        :custom-label="name_pegawai" 
                                        placeholder="Select one" 
                                        label="nama" 
                                        track-by="nama" 
                                        v-validate data-vv-rules="required" 
                                        name="detailpegawai"
                                        @input="">
                                    </vue-multiselect>
                                    <span class="text-red">{{ errors.first('step1.jenis_gaji') }}</span>
                                </div>
                        </div>
                    </div>  
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="exampleInputEmail1">Nominal </label>
                              <money  type="text" v-bind="money" class="form-control" v-validate="'required|numeric'" name="gaji_pokok" v-model="potongan.nominal" placeholder="" data-vv-scope="step1" :disabled="false"> </money>    
                        </div>
                    </div>                     
                    <div class="col-md-12 page-header">
                        <div class="form-group">
                            <button type="button" class="btn btn-success" @click.prevent="savePotonganData()" style="width: 100%">Add</button>    
                        </div>
                    </div>      
                    <div class="box-body">
                            <table class="table is-bordered is-hoverable">
                                <thead class="text-white bg-dark">
                                    <th class="text-white">#</th>
                                    <th class="text-white">Nama</th>
                                    <th class="text-white">Nominal</th>
                                    <th class="text-white">Jenis</th>
                                    <th class="text-white">Periode</th>
                                    <th class="text-white">Aksi</th>
                                </thead>
                                <tbody class="table-light">
                                    <tr v-for="(data,index) in rekapPotongan" class="table-default">
                                        <td style="padding-left: 0">{{index+1}}</td>
                                        <td style="padding-left: 0">{{data.nama}}</td> 
                                        <td style="padding-left: 0">{{formatPrice(data.nominal)}}</td> 
                                        <td style="padding-left: 0">{{data.jenis_potongan}}</td> 
                                        <td style="padding-left: 0">{{customFormatter(data.periode_gaji)}}</td> 
                                        <td style="padding-left: 0">

                                            <button type="button" 
                                                    class="btn btn-info" 
                                                    @click=
                                                        "deleteRekap(index);">
                                                <i class="fa fa-download"></i>        
                                                Delete
                                            </button>

                                           

                                            
                                        </td>
                                    </tr>
                                    <tr v-if="emptyResult">
                                        <td colspan="9" rowspan="4" class="text-center h1">No Record Found</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="col-md-12 page-header">
                                <div class="form-group">
                                    <button type="button" class="btn btn-warning" v-if="isShowFinish" @click.prevent="finishPotonganData()" style="width: 100%">Finish</button>    
                                </div>
                            </div>      
                        </div>
                        <pagination 
                            :current_page="currentPage" 
                            :row_count_page="rowCountPage" 
                            @page-update="pageUpdate" 
                            :total_users="totalData" 
                            :page_range="pageRange">
                            
                            </pagination>
    </div>
</script>

