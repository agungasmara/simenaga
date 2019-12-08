


<script type="text/x-template" id="penggajianTable">
    <div>
                  <div class="box-body">
                            <table class="table is-bordered is-hoverable">
                                <thead class="text-white bg-dark">
                                    <th class="text-white">ID</th>
                                    <th class="text-white">Nama Pegawai</th>
                                    <th class="text-white">Jenis Pendapatan</th>
                                    <th class="text-white">Pendapatan</th>
                                    <th class="text-white">Total Potongan</th>
                                    <th class="text-white">Sisa</th>
                                    <th class="text-white">Periode</th>
                                    <th class="text-white">Action</th>
                                </thead>
                                <tbody class="table-light">
                                    <tr v-for="data in penggajian" class="table-default">
                                        <td>{{data.idrekap}}</td>
                                        <td>{{data.nama}}</td> 
                                        <td>{{data.jenis_gaji_nama}}</td> 
                                        <td>{{formatPrice(data.pendapatan)}}</td> 
                                        <td>{{getTotalPotongan(data)}}</td> 
                                        <td>{{getSisaPendapatan(data)}}</td> 
                                        <td>{{customFormatter(data.periode_gaji)}}</td> 
                                        <td>

                                            <button type="button" 
                                                    class="btn btn-info" 
                                                    @click=
                                                        "selectpenggajian(data);getDatachoosePenggajian();selectJenisForm(data.hasil_verifikasi);getJenisForm()">

                                                Detail
                                            </button>          
                                            <button type="button" 
                                                    class="btn btn-info" 
                                                    @click=
                                                        "downloadStruk(data);">

                                                Struk
                                            </button>           
                                            <button type="button" 
                                                    class="btn btn-info" 
                                                    @click=
                                                        "sendEmailGaji(data.idrekap);">

                                                Email
                                            </button>  

                                            
                                        </td>
                                    </tr>
                                    <tr v-if="emptyResult">
                                        <td colspan="9" rowspan="4" class="text-center h1">No Record Found</td>
                                    </tr>
                                </tbody>
                            </table>
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

