


<script type="text/x-template" id="rekapPenggajianTable">
    <div>
                  <div class="box-body">
                            <table class="table is-bordered is-hoverable">
                                <thead class="text-white bg-dark">
                                    <th class="text-white">#</th>
                                    <th class="text-white">Periode</th>
                                    <th class="text-white">Jenis Gaji</th>
                                    <th class="text-white">Total Gaji</th>
                                    <th class="text-white">Aksi</th>
                                </thead>
                                <tbody class="table-light">
                                    <tr v-for="(data,index) in rekap" class="table-default">
                                        <td style="padding-left: 0">{{index+1}}</td>
                                        <td style="padding-left: 0">{{customFormatter(data.per_gaji)}}</td> 
                                        <td style="padding-left: 0">{{data.jen_gaji}}</td> 
                                        <td style="padding-left: 0">{{formatPrice(data.tot_gaji)}}</td> 
                                        <td style="padding-left: 0">

                                            <button type="button" 
                                                    class="btn btn-info" 
                                                    @click=
                                                        "downloadGaji(data);">
                                                <i class="fa fa-download"></i>        
                                                Download
                                            </button>                                            

                                            <button type="button" 
                                                    class="btn btn-info" 
                                                    @click=
                                                        "sendEmailGaji(data.id);">
                                                <i class="fa fa-download"></i>        
                                                Struk
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

