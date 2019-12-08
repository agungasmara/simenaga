


<script type="text/x-template" id="pegawaiTable">
    <div>
                  <div class="box-body">
                            <table class="table is-bordered is-hoverable">
                                <thead class="text-white bg-dark">
                                    <th class="text-white">ID</th>
                                    <th class="text-white">Nama Pegawai</th>
                                    <th class="text-white">Jabatan</th>
                                    <th class="text-white">Nip</th>
                                    <th class="text-white">Golongan</th>
                                    <th class="text-white">Action</th>
                                </thead>
                                <tbody class="table-light">
                                    <tr v-for="data in pegawai" class="table-default">
                                        <td>{{data.id}}</td>
                                        <td>{{data.nama}}</td> 
                                        <td>{{data.jabatan}}</td> 
                                        <td>{{data.nip}}</td> 
                                        <td>{{data.golongan}}</td> 
                                        <td>

                                            <button type="button" 
                                                    class="btn btn-info" 
                                                    @click=
                                                        "selectpegawai(data);getDatachoosePegawai();">

                                                View Details
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

