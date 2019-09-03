
var datepickerOptions = {}
Vue.use(window.AirbnbStyleDatepicker, datepickerOptions)
Vue.use(VueFormWizard)
Vue.use(VeeValidate)
Vue.use(VueTheMask)
Vue.use(VueMultiselect)
Vue.component('vue-multiselect', window.VueMultiselect.default)

//dynamic url
let myUrl = window.location.origin+"/";

if(myUrl.includes("localhost")){
  var pathArray = window.location.pathname.split( '/' );
  myUrl += pathArray [1] + "/";
}


Vue.component('verifikasi-pspbmn-kpknl', {
            template: '#pspVerifikasiWizardFormKPKNL',
            props: ['datapengajuan','tipepengajuan','jenisform'],
            data() {
                 return {
                    url: myUrl,
                    choosePengajuan:this.datapengajuan,
                    verifikasi:{
                        id: '',
                        idPengajuan : '',
                        nama_petugas : '123',
                        nip_petugas : '123',
                        nip_kepala_seksi:'',
                        nama_kepala_seksi:'',
                        jabatan_kepala_seksi:'',
                        status_kepala_seksi:'',
                        nip_kepala_bidang:'',            
                        nama_kepala_bidang:'',            
                        jabatan_kepala_bidang:'',            
                        status_kepala_bidang:'',
                        nip_kepala_kanwil:'',                        
                        nama_kepala_kanwil:'',                        
                        jabatan_kepala_kanwil:'',                        
                        status_kepala_kanwil:'',
                        check_jenis_bmn:'sesuai',
                        check_nilai_bmn:'sesuai',
                        check_surat_permohonan:'sesuai',
                        check_rincian_usulan_bmn:'sesuai',
                        check_kib:'sesuai',
                        check_foto_bmn:'sesuai',
                        check_sk_delegasi:'sesuai',
                        check_dokumen_kepemilikan:'ada',
                        check_fc_dokumen_kepemilikan:'sesuai',
                        check_sptjm_bermaterai:'sesuai',
                        check_kebenaran_fc_dokumen_kepemilikan:'sesuai',
                        noteDokumen:'sesuai',
                        jabatan_salinan:'',
                        nama_salinan:'',
                        nip_salinan:'',
                        daftar_tembusan:''
                    },       

                        showDocumentVerifikasiFinal:false,             
                    daftarTembusan:[{
                                        nama:''
                                    }],

                    daftarKekuranganData:[
                                    { nama:''}
                                    ],
                    option_data_kepala_seksi_kpknl:[],
                    option_data_kepala_bidang_kpknl:[],
                    temp_data_kepala_seksi_kpknl:{
                                              jabatan : '',
                                              status : '',
                                              nip : '',          
                                              nama : '' 
                                            },
                    temp_data_kepala_bidang_kpknl:{
                                              jabatan : '',
                                              status : '',
                                              nip : '',          
                                              nama : '' 
                                            },
                      data_kepala_seksi_kpknl:null,
                      data_kepala_bidang_kpknl:null,
                      showStatusJabatanKasi:false,
                      showStatusJabatanKabid:false,
                      isAdaDokumenKepemilikan: true,
                      showButtonhasilVerifikasi: true,
                      isButuhSurveyLapangan: false,
                      isButuhKelengkapanData: false,
                      isGenerateKMKDoc: false,
                      isShowUploadDokumenVerifikasi: false,
                      isShowLast: false,
                      jenisForm:this.jenisform
                }

            },
            created(){
                this.getKepalaSeksiKPKNL() 
                this.getKepalaBidangKPKNL() 
                this.getDataVerifikasiDokumen()
            },
            computed: {
                // a computed getter
                hrefFileSuratPermohon: function () {
                    // `this` points to the vm instance
                    return this.url+'/uploads/'+this.choosePengajuan.fileSuratPermohon
                    // return this.url
                },
                // a computed getter
                hrefFileDaftarRincian: function () {
                    // `this` points to the vm instance
                    return this.url+'/uploads/'+this.choosePengajuan.fileDaftarRincian
                    //return this.url
                },
                // a computed getter
                hrefFileDokumenKelengkapan: function () {
                    // `this` points to the vm instance
                    return this.url+'/uploads/'+this.choosePengajuan.fileDokumenKelengkapan
                    //return this.url
                }
            },
            methods:{

                uploadFile: function() {

                    this.file1 = this.$refs.fileSuratPermohon.files[0];
                    this.file2 = this.$refs.fileDaftarRincian.files[0];
                    this.file3 = this.$refs.fileDokumenKelengkapan.files[0];
                    this.file4 = this.$refs.fileUploadBackupSimak.files[0];

                    if (this.file1 && this.file2 && this.file3 && this.file4) {

                        let formData = new FormData();
                        formData.append('file1', this.file1);
                        formData.append('file2', this.file2);
                        formData.append('file3', this.file3);
                        formData.append('file4', this.file4);

                        axios.post(this.url + '/hideend/pengajuan/uploadFile', formData, {
                                headers: {
                                    'Content-Type': 'multipart/form-data'
                                }
                            })
                            .then(function(response) {
                                if (!response.data) {
                                    alert('File not uploaded All. Please check one of your file');
                                } else {
                                    v.pengajuan.fileSuratPermohon = response.data.file[0]
                                    v.pengajuan.fileDaftarRincian = response.data.file[1]
                                    v.pengajuan.fileDokumenKelengkapan = response.data.file[2]
                                    v.pengajuan.fileUploadBackupSimak = response.data.file[3]

                                }

                            })
                            .catch(function(error) {
                                console.log(error);
                            });
                    }

                },
                generateKMKDoc(){
                    this.isGenerateKMKDoc = true
                    this.isButuhKelengkapanData = false
                    this.isButuhSurveyLapangan = false

                    let GabungData = {...this.verifikasi,...this.choosePengajuan}

                    console.log(GabungData)
                    var formData = this.formData(GabungData);
                    let self = this
                    axios.post(this.url + "/hideend/verifikasi/generateDocKPKNL/"+this.choosePengajuan.id).then(function(response) {
                                
                            if (response.data.dokumen) {

           
                            }
                        })

                },
                butuhKelengkapanData(){
                    this.isGenerateKMKDoc = false
                    this.isButuhKelengkapanData = true
                    this.isButuhSurveyLapangan = false
                },
                butuhSurveyLapangan(){
                    this.isGenerateKMKDoc = false
                    this.isButuhKelengkapanData = false
                    this.isButuhSurveyLapangan = true
                },
                //1
                deleteRowKurangData(index){
                    if(true){
                        this.daftarKekuranganData.splice(index, 1);
                    }
                },
                deleteRow(index){
                    if(true){
                        this.daftarTembusan.splice(index, 1);
                    }
                },


                addRowKurangData(){
                    this.daftarKekuranganData.push({'nama': ''});
                },

                addRowTembusan(){
                    this.daftarTembusan.push({'nama': ''});
                },
                getDataVerifikasiDokumen:function(){
                    let self = this
                    axios.post(this.url + "/hideend/verifikasi/checkDocumentVerifikasi/"+this.choosePengajuan.id).then(function(response) {
                                
                            if (response.data.dokumen) {

                                self.showStatusJabatanKasi = true
                                self.showStatusJabatanKabid = true


                                self.verifikasi =  response.data.dokumen[0]
                                self.data_kepala_seksi_kpknl = {
                                                        jabatan : response.data.dokumen[0].jabatan_kepala_seksi,
                                                        status : response.data.dokumen[0].status_kepala_seksi,
                                                        nip : response.data.dokumen[0].nip_kepala_seksi,          
                                                        nama : response.data.dokumen[0].nama_kepala_seksi 
                                                }
                                self.temp_data_kepala_seksi_kpknl = {
                                                        jabatan : response.data.dokumen[0].jabatan_kepala_seksi,
                                                        status : response.data.dokumen[0].status_kepala_seksi,
                                                        nip : response.data.dokumen[0].nip_kepala_seksi,          
                                                        nama : response.data.dokumen[0].nama_kepala_seksi
                                                }                        
                                self.data_kepala_bidang_kpknl = {
                                                        jabatan : response.data.dokumen[0].jabatan_kepala_bidang,
                                                        status : response.data.dokumen[0].status_kepala_bidang,
                                                        nip : response.data.dokumen[0].nip_kepala_bidang,          
                                                        nama : response.data.dokumen[0].nama_kepala_bidang 
                                                }

                                self.temp_data_kepala_bidang_kpknl = {
                                                        jabatan : response.data.dokumen[0].jabatan_kepala_bidang,
                                                        status : response.data.dokumen[0].status_kepala_bidang,
                                                        nip : response.data.dokumen[0].nip_kepala_bidang,          
                                                        nama : response.data.dokumen[0].nama_kepala_bidang
                                                }

                                self.daftarTembusan = JSON.parse(response.data.dokumen[0].daftar_tembusan)             
                            }
                        })
                },

                clearAllForm(){
                    this.verifikasi={
                            id: '',
                            idPengajuan : '',
                            nama_petugas : '',
                            nip_petugas : '',
                            nip_kepala_seksi:'',
                            nama_kepala_seksi:'',
                            jabatan_kepala_seksi:'',
                            status_kepala_seksi:'',
                            nip_kepala_bidang:'',            
                            nama_kepala_bidang:'',            
                            jabatan_kepala_bidang:'',            
                            status_kepala_bidang:'',
                            nip_kepala_kanwil:'',                        
                            nama_kepala_kanwil:'',                        
                            jabatan_kepala_kanwil:'',                        
                            status_kepala_kanwil:'',
                            check_jenis_bmn:'',
                            check_nilai_bmn:'',
                            check_surat_permohonan:'',
                            check_rincian_usulan_bmn:'',
                            check_kib:'',
                            check_foto_bmn:'',
                            check_sk_delegasi:'',
                            check_dokumen_kepemilikan:'',
                            check_fc_dokumen_kepemilikan:'',
                            check_sptjm_bermaterai:'',
                            check_kebenaran_fc_dokumen_kepemilikan:'',
                            noteDokumen:'',
                            jabatan_salinan:'',
                            nama_salinan:'',
                            nip_salinan:'',
                            daftar_tembusan:''
                        }            

                },
                finishVerifikasiProses(){
                    this.clearAllForm()
                    let valueHide ={
                                    isShowFormKPKNL : false                                    
                                }
                    this.$emit('send-data', valueHide)
                },
                checklistVerifikasi($jenisButton,$value){
                    if($jenisButton==='check_jenis_bmn'){
                        this.verifikasi.check_jenis_bmn = $value
                    }
                    if($jenisButton==='check_nilai_bmn'){
                        this.verifikasi.check_nilai_bmn = $value
                    }
                    if($jenisButton==='check_surat_permohonan'){
                        this.verifikasi.check_surat_permohonan = $value
                    }
                    if($jenisButton==='check_rincian_usulan_bmn'){
                        this.verifikasi.check_rincian_usulan_bmn = $value
                    }
                    if($jenisButton==='check_kib'){
                        this.verifikasi.check_kib = $value
                    }
                    if($jenisButton==='check_foto_bmn'){
                        this.verifikasi.check_foto_bmn = $value
                    }
                    if($jenisButton==='check_sk_delegasi'){
                        this.verifikasi.check_sk_delegasi = $value
                    }
                    if($jenisButton==='check_dokumen_kepemilikan'){
                        this.verifikasi.check_dokumen_kepemilikan = $value
                    }
                    if($jenisButton==='check_fc_dokumen_kepemilikan'){
                        this.verifikasi.check_fc_dokumen_kepemilikan = $value
                    }
                    if($jenisButton==='check_sptjm_bermaterai'){
                        this.verifikasi.check_sptjm_bermaterai = $value
                    }
                    if($jenisButton==='check_kebenaran_fc_dokumen_kepemilikan'){
                        this.verifikasi.check_kebenaran_fc_dokumen_kepemilikan = $value
                    }

                },

                //ubah ini semua
                pickStatusJabatanKasiKPKNL(statusJabatan) {

                     if(statusJabatan === this.temp_data_kepala_seksi_kpknl.status ){
                        
                           this.data_kepala_seksi_kpknl = {
                                                        jabatan : this.temp_data_kepala_seksi_kpknl.jabatan,
                                                        status : statusJabatan,
                                                        nip : this.temp_data_kepala_seksi_kpknl.nip,          
                                                        nama : this.temp_data_kepala_seksi_kpknl.nama 
                                                    }
                    }else{
                            this.data_kepala_seksi_kpknl = {
                                                        jabatan : this.temp_data_kepala_seksi_kpknl.jabatan,
                                                        status : statusJabatan,
                                                        nip : '',          
                                                        nama : '' 
                                                    }
                    }
                },
                pickStatusJabatanKabidKPKNL(statusJabatan) {

                    if(statusJabatan === this.temp_data_kepala_bidang_kpknl.status ){
                            this.data_kepala_bidang_kpknl = {
                                                       jabatan : this.temp_data_kepala_bidang_kpknl.jabatan,
                                                       status : statusJabatan,
                                                       nip : this.temp_data_kepala_bidang_kpknl.nip,          
                                                       nama : this.temp_data_kepala_bidang_kpknl.nama 
                                                    } 
                    }else{
                            this.data_kepala_bidang_kpknl = {
                                                    jabatan :this.temp_data_kepala_bidang_kpknl.jabatan,
                                                    status : statusJabatan,
                                                    nip : '',          
                                                    nama : ''}
                    }
                },        
                //DATA KPKNL
                setTempJabatanKepalaSeksiKPKNL() {
                    this.temp_data_kepala_seksi_kpknl = {
                                               jabatan : this.data_kepala_seksi_kpknl.jabatan,
                                               status : this.data_kepala_seksi_kpknl.status,
                                               nip : this.data_kepala_seksi_kpknl.nip,          
                                               nama : this.data_kepala_seksi_kpknl.nama 
                                          }

                },       
                //DATA KPKNL
                setTempJabatanKepalaBidangKPKNL() {
                    this.temp_data_kepala_bidang_kpknl = {
                                               jabatan : this.data_kepala_bidang_kpknl.jabatan,
                                               status : this.data_kepala_bidang_kpknl.status,
                                               nip : this.data_kepala_bidang_kpknl.nip,          
                                               nama : this.data_kepala_bidang_kpknl.nama 
                                          }

                }, 
                getKepalaBidangKPKNL() {
                    let self = this
                    axios.get(this.url + "/theme_costume/static_content/kepala_bidangPKN.json")
                        .then(response => {
                            self.option_data_kepala_bidang_kpknl = response.data.jabatan_kepala_bidang
                        })
                },     
                getKepalaSeksiKPKNL() {
                    let self = this
                    axios.get(this.url + "/theme_costume/static_content/kepala_seksiPKN.json")
                        .then(response => {
                            self.option_data_kepala_seksi_kpknl = response.data.jabatan_kepala_seksi
                        })
                },
                name_jabatan_kepala_seksi_kpknl({jabatan}) {
                    return `${jabatan}` 
                },        
                name_jabatan_kepala_bidang_kpknl({jabatan}) {
                    return `${jabatan}` 
                },

                
                beforeTab1SwitchKPKNL: function() {

                    let self = this
                    return this.$validator.validateAll("step1").then((result) => {
                        if (!result) {
                            alert('mohon melengkapi seluruh form diatas')
                            return false;
                        } else {
                            this.addVerifikasi("Proses by Verifikator")
                            return true
                        }

                    })
                },
                beforeTab2SwitchKPKNL: function() {
                    this.addVerifikasi("Dokumen Fisik telah Dicek")
                    return true
                },
                beforeTab3SwitchKPKNL: function() {
                    this.verifikasi.daftar_tembusan = JSON.stringify(this.daftarTembusan)
                    this.addVerifikasi("Dokumen Fisik telah Dicek")
                    return true
                },

                addVerifikasi:function(status) {
                    //Assign Kepala Seksi
                    this.verifikasi.jabatan_kepala_seksi = this.data_kepala_seksi_kpknl.jabatan
                    this.verifikasi.status_kepala_seksi = this.data_kepala_seksi_kpknl.status
                    this.verifikasi.nama_kepala_seksi = this.data_kepala_seksi_kpknl.nama
                    this.verifikasi.nip_kepala_seksi = this.data_kepala_seksi_kpknl.nip

                    //Assign Kepala Bidang
                    this.verifikasi.jabatan_kepala_bidang = this.data_kepala_bidang_kpknl.jabatan
                    this.verifikasi.status_kepala_bidang = this.data_kepala_bidang_kpknl.status
                    this.verifikasi.nama_kepala_bidang = this.data_kepala_bidang_kpknl.nama
                    this.verifikasi.nip_kepala_bidang = this.data_kepala_bidang_kpknl.nip
                    this.verifikasi.idPengajuan = this.choosePengajuan.id

                    this.status_pengajuan = status

                    var formData = this.formData(this.verifikasi);
                    let self = this
                    if(this.verifikasi.id!=''){
                        axios.post(this.url + "/hideend/verifikasi/update", formData).then(function(response) {
                            if (response.data.error) {
                                console.log(response.data.msg);
                            } else {
                                self.updateStatusPengajuan()
                            }
                         })
                    }else{
                        axios.post(this.url + "/hideend/verifikasi/add", formData).then(function(response) {
                            if (response.data.error) {
                                console.log(response.data.msg);
                            } else {
                                self.verifikasi.id =response.data.id
                                self.updateStatusPengajuan()
                            }
                        })
                    }
                    

                },
                updateStatusPengajuan(){
                    let pengajuan= {
                                idPengajuan:this.choosePengajuan.id,
                                status_pengajuan: this.status_pengajuan
                              }
                    var formData = this.formData(pengajuan);
                    axios.post(this.url + "/hideend/pengajuan/updateStatusPengajuan", formData).then(function(response) {
                            if (!response.data.error) {
                                return true;
                            } else {
                                return false;
                            }
                        })
                },
                formData(obj) {
                    var formData = new FormData();
                    for (var key in obj) {
                        formData.append(key, obj[key]);
                    }
                    return formData;
                },

                    }
                })

Vue.component('verifikasi-pspbmn-kanwil', {
            template: '#pspVerifikasiWizardFormKANWIL',
            props: ['datapengajuan','tipepengajuan','jenisform'],
            data() {
                 return {
                    url: 'http://localhost/pspbmn',
                    choosePengajuan:this.datapengajuan,
                    verifikasi:{
                        id: '',
                        idPengajuan : '',
                        nama_petugas : '123',
                        nip_petugas : '123',
                        nip_kepala_seksi:'',
                        nama_kepala_seksi:'',
                        jabatan_kepala_seksi:'',
                        status_kepala_seksi:'',
                        nip_kepala_bidang:'',            
                        nama_kepala_bidang:'',            
                        jabatan_kepala_bidang:'',            
                        status_kepala_bidang:'',
                        nip_kepala_kanwil:'',                        
                        nama_kepala_kanwil:'',                        
                        jabatan_kepala_kanwil:'',                        
                        status_kepala_kanwil:'',
                        check_jenis_bmn:'sesuai',
                        check_nilai_bmn:'sesuai',
                        check_surat_permohonan:'sesuai',
                        check_rincian_usulan_bmn:'sesuai',
                        check_kib:'sesuai',
                        check_foto_bmn:'sesuai',
                        check_sk_delegasi:'sesuai',
                        check_dokumen_kepemilikan:'ada',
                        check_fc_dokumen_kepemilikan:'sesuai',
                        check_sptjm_bermaterai:'sesuai',
                        check_kebenaran_fc_dokumen_kepemilikan:'sesuai',
                        noteDokumen:'sesuai',
                        jabatan_salinan:'',
                        nama_salinan:'',
                        nip_salinan:'',
                        daftar_tembusan:'',
                        fileNDSPersetujuan:'',
                        fileHasilVerifikasi:'',
                        fileKMK:'',
                        fileKMK:'',
                        fileNDSPermintaanKelengkapan:'',
                        fileNDSSurveyLapangan:'',
                        daftarKekuranganData:''

                    },          
                        showDocumentVerifikasiFinal:false,         
                    daftarTembusan:[
                                    { nama:''}
                                    ],          
                    daftarKekuranganData:[
                                    { nama:''}
                                    ],
                    option_data_kepala_seksi_kanwil:[],
                    option_data_kepala_bidang_kanwil:[],
                    option_data_kepala_kanwil:[],
                    temp_data_kepala_seksi_kanwil:{
                                              jabatan : '',
                                              status : '',
                                              nip : '',          
                                              nama : '' 
                                            },
                    temp_data_kepala_bidang_kanwil:{
                                              jabatan : '',
                                              status : '',
                                              nip : '',          
                                              nama : '' 
                                            },
                    temp_data_kepala_kanwil:{
                                              jabatan : '',
                                              status : '',
                                              nip : '',          
                                              nama : '' 
                                            },
                      data_kepala_seksi_kanwil:null,
                      data_kepala_bidang_kanwil:null,
                      data_kepala_kanwil:null,
                      showStatusJabatanKasi:false,
                      showStatusJabatanKabid:false,
                      showStatusJabatanKanwil:false,
                      isAdaDokumenKepemilikan: true,
                      showButtonhasilVerifikasi: true,
                      isGenerateKMKDoc : false,
                        isButuhKelengkapanData : false,
                        isButuhSurveyLapangan : false,
                      isShowLast: false,
                      isShowUploadWizardForm: false,
                      isShowVerifikasiForm: true,
                      jenisForm: this.jenisform,
                        generateHasilVerifikasiKANWIL : false
                }

            },
            created(){
                this.getKepalaSeksiKANWIL() 
                this.getKepalaBidangKANWIL() 
                this.getKepalaKANWIL() 
                this.getDataVerifikasiDokumen()
            },
            computed: {
                // a computed getter
                hrefFileSuratPermohon: function () {
                    // `this` points to the vm instance
                    return this.url+'/uploads/'+this.choosePengajuan.fileSuratPermohon
                    // return this.url
                },
                // a computed getter
                hrefFileDaftarRincian: function () {
                    // `this` points to the vm instance
                    return this.url+'/uploads/'+this.choosePengajuan.fileDaftarRincian
                    //return this.url
                },
                // a computed getter
                hrefFileDokumenKelengkapan: function () {
                    // `this` points to the vm instance
                    return this.url+'/uploads/'+this.choosePengajuan.fileDokumenKelengkapan
                    //return this.url
                },

                 // a computed getter
                hreffileNDSPersetujuan: function () {
                    // `this` points to the vm instance
                    return this.url+this.verifikasi.fileNDSPersetujuan
                    // return this.url
                },
                // a computed getter
                hreffileHasilVerifikasi: function () {
                    // `this` points to the vm instance
                    return this.url+this.verifikasi.fileHasilVerifikasi
                    //return this.url
                },
                // a computed getter
                hreffileKMK: function () {
                    // `this` points to the vm instance
                    return this.url+this.verifikasi.fileKMK
                    //return this.url
                },
                // a computed getter
                hreffileSalinanKMK: function () {
                    // `this` points to the vm instance
                    return this.url+this.verifikasi.fileKMK
                    //return this.url
                },
                // a computed getter
                hreffileNDSPermintaanKelengkapan: function () {
                    // `this` points to the vm instance
                    return this.url+this.verifikasi.fileNDSPermintaanKelengkapan
                    //return this.url
                },
                // a computed getter
                hreffileNDSSurveyLapangan: function () {
                    // `this` points to the vm instance
                    return this.url+this.verifikasi.fileNDSSurveyLapangan
                    //return this.url
                }
            },
            methods:{

                saveDataSurveyLapangan(){
                    this.isGenerateKMKDoc = false
                    this.isButuhKelengkapanData = false
                    this.isButuhSurveyLapangan = true

                    var formData = this.formData(this.verifikasi);
                    let self = this
                    axios.post(this.url + "/hideend/verifikasi/butuhSurveyLapangan/",formData).then(function(response) {
                            if (response.data.dokumen) {
                               

           
                            }
                        })
                },
                saveKelengkapanData(){
                    this.isGenerateKMKDoc = false
                    this.isButuhKelengkapanData = true
                    this.isButuhSurveyLapangan = false

                    this.verifikasi.daftarKekuranganData = JSON.stringify(this.daftarKekuranganData)                    
                    var formData = this.formData(this.verifikasi);
                    let self = this
                    axios.post(this.url + "/hideend/verifikasi/butuhKelengkapanData/",formData).then(function(response) {
                            if (response.data.dokumen) {
                               

           
                            }
                        })
                },
                showUploadWizardForm(){
                    this.isShowUploadWizardForm = true;
                    this.isShowVerifikasiForm = false;

                },

                uploadFile: function() {

                    this.file1 = this.$refs.fileNDSPersetujuan.files[0];
                    this.file2 = this.$refs.fileHasilVerifikasi.files[0];
                    this.file3 = this.$refs.fileKMK.files[0];
                    this.file4 = this.$refs.fileKMK.files[0];
                    this.file5 = this.$refs.fileNDSPermintaanKelengkapan.files[0];
                    this.file6 = this.$refs.fileNDSSurveyLapangan.files[0];

                    if (this.file1 && this.file2 && this.file3 && this.file4 && this.file5 && this.file6) {

                        let formData = new FormData();
                        formData.append('file1', this.file1);
                        formData.append('file2', this.file2);
                        formData.append('file3', this.file3);
                        formData.append('file4', this.file4);
                        formData.append('file5', this.file4);
                        formData.append('file6', this.file4);

                        axios.post(this.url + '/hideend/verifikasi/uploadFile', formData, {
                                headers: {
                                    'Content-Type': 'multipart/form-data'
                                }
                            })
                            .then(function(response) {
                                if (!response.data) {
                                    alert('File not uploaded All. Please check one of your file');
                                } else {
                                    this.verifikasi.fileNDSPersetujuan = response.data.file[0]
                                    this.verifikasi.fileHasilVerifikasi = response.data.file[1]
                                    this.verifikasi.fileKMK = response.data.file[2]
                                    this.verifikasi.fileKMK = response.data.file[3]
                                    this.verifikasi.fileNDSPermintaanKelengkapan = response.data.file[4]
                                    this.verifikasi.fileNDSSurveyLapangan = response.data.file[5]

                                }

                            })
                            .catch(function(error) {
                                console.log(error);
                            });
                    }

                },
                btnGenerateKMKDoc(){
                    this.isGenerateKMKDoc = true
                    this.isButuhKelengkapanData = false
                    this.isButuhSurveyLapangan = false
                    let GabungData = {...this.verifikasi,...this.choosePengajuan}

                    GabungData.id = this.verifikasi.id
                    console.log(GabungData)
                    var formData = this.formData(GabungData);
                    let self = this
                    axios.post(this.url + "/hideend/verifikasi/generateDocKANWIL/",formData).then(function(response) {
                            if (response.data.dokumen) {
                                self.verifikasi.fileNDSPersetujuan = response.data.dokumen.fileNDSPersetujuan
                                self.verifikasi.fileHasilVerifikasi = response.data.dokumen.fileHasilVerifikasi
                                self.verifikasi.fileKMK = response.data.dokumen.fileKMK
                                self.verifikasi.fileSalinanKMK = response.data.dokumen.fileSalinanKMK
                                self.verifikasi.fileNDSPermintaanKelengkapan = response.data.dokumen.fileNDSPermintaanKelengkapan
                                self.verifikasi.fileNDSSurveyLapangan = response.data.dokumen.fileNDSSurveyLapangan

           
                            }
                        })
                },
                generateKMKDoc(){
                    this.isGenerateKMKDoc = true
                    this.isButuhKelengkapanData = false
                    this.isButuhSurveyLapangan = false
                },
                butuhKelengkapanData(){
                    this.isGenerateKMKDoc = false
                    this.isButuhKelengkapanData = true
                    this.isButuhSurveyLapangan = false
                },
                butuhSurveyLapangan(){
                    this.isGenerateKMKDoc = false
                    this.isButuhKelengkapanData = false
                    this.isButuhSurveyLapangan = true
                },
                //2
                deleteRowKurangData(index){
                    if(true){
                        this.daftarKekuranganData.splice(index, 1);
                    }
                },
                deleteRow(index){
                    if(true){
                        this.daftarTembusan.splice(index, 1);
                    }
                },
                getDataVerifikasiDokumen:function(){
                    let self = this
                    axios.post(this.url + "/hideend/verifikasi/checkDocumentVerifikasi/"+this.choosePengajuan.id).then(function(response) {
                                
                            if (response.data.dokumen) {

                                self.showStatusJabatanKasi = true
                                self.showStatusJabatanKabid = true
                                self.showStatusJabatanKanwil = true


                                self.verifikasi =  response.data.dokumen[0]
                                self.data_kepala_seksi_kanwil = {
                                                        jabatan : response.data.dokumen[0].jabatan_kepala_seksi,
                                                        status : response.data.dokumen[0].status_kepala_seksi,
                                                        nip : response.data.dokumen[0].nip_kepala_seksi,          
                                                        nama : response.data.dokumen[0].nama_kepala_seksi 
                                                }
                                self.temp_data_kepala_seksi_kanwil  = {
                                                        jabatan : response.data.dokumen[0].jabatan_kepala_seksi,
                                                        status : response.data.dokumen[0].status_kepala_seksi,
                                                        nip : response.data.dokumen[0].nip_kepala_seksi,          
                                                        nama : response.data.dokumen[0].nama_kepala_seksi
                                                }                        
                                self.data_kepala_bidang_kanwil  = {
                                                        jabatan : response.data.dokumen[0].jabatan_kepala_bidang,
                                                        status : response.data.dokumen[0].status_kepala_bidang,
                                                        nip : response.data.dokumen[0].nip_kepala_bidang,          
                                                        nama : response.data.dokumen[0].nama_kepala_bidang 
                                                }

                                self.temp_data_kepala_bidang_kanwil = {
                                                        jabatan : response.data.dokumen[0].jabatan_kepala_bidang,
                                                        status : response.data.dokumen[0].status_kepala_bidang,
                                                        nip : response.data.dokumen[0].nip_kepala_bidang,          
                                                        nama : response.data.dokumen[0].nama_kepala_bidang
                                                }                    
                                self.data_kepala_kanwil  = {
                                                        jabatan : response.data.dokumen[0].jabatan_kepala_kanwil,
                                                        status : response.data.dokumen[0].status_kepala_kanwil,
                                                        nip : response.data.dokumen[0].nip_kepala_kanwil,          
                                                        nama : response.data.dokumen[0].nama_kepala_kanwil 
                                                }

                                self.temp_data_kepala_kanwil = {
                                                        jabatan : response.data.dokumen[0].jabatan_kepala_kanwil,
                                                        status : response.data.dokumen[0].status_kepala_kanwil,
                                                        nip : response.data.dokumen[0].nip_kepala_kanwil,          
                                                        nama : response.data.dokumen[0].nama_kepala_kanwil
                                                }

                                self.daftarTembusan = JSON.parse(response.data.dokumen[0].daftar_tembusan)
                            }
                        })
                },
                clearAllForm(){
                    this.verifikasi={
                            id: '',
                            idPengajuan : '',
                            nama_petugas : '',
                            nip_petugas : '',
                            nip_kepala_seksi:'',
                            nama_kepala_seksi:'',
                            jabatan_kepala_seksi:'',
                            status_kepala_seksi:'',
                            nip_kepala_bidang:'',            
                            nama_kepala_bidang:'',            
                            jabatan_kepala_bidang:'',            
                            status_kepala_bidang:'',
                            nip_kepala_kanwil:'',                        
                            nama_kepala_kanwil:'',                        
                            jabatan_kepala_kanwil:'',                        
                            status_kepala_kanwil:'',
                            check_jenis_bmn:'',
                            check_nilai_bmn:'',
                            check_surat_permohonan:'',
                            check_rincian_usulan_bmn:'',
                            check_kib:'',
                            check_foto_bmn:'',
                            check_sk_delegasi:'',
                            check_dokumen_kepemilikan:'',
                            check_fc_dokumen_kepemilikan:'',
                            check_sptjm_bermaterai:'',
                            check_kebenaran_fc_dokumen_kepemilikan:'',
                            noteDokumen:'',
                            jabatan_salinan:'',
                            nama_salinan:'',
                            nip_salinan:'',
                            daftar_tembusan:''
                        }            

                },
                finishVerifikasiProses(){
                    this.clearAllForm()

                    this.isShowUploadWizardForm = false;
                    this.isShowVerifikasiForm = false;
                    let valueHide ={
                                    isShowFormKANWIL : false                                    
                                }
                    this.$emit('send-data', valueHide)
                },
                addRowKurangData(){
                    this.daftarKekuranganData.push({'nama': ''});
                },
                addRowTembusan(){
                    this.daftarTembusan.push({'nama': ''});
                },
                checklistVerifikasi($jenisButton,$value){
                    if($jenisButton==='check_jenis_bmn'){
                        this.verifikasi.check_jenis_bmn = $value
                    }
                    if($jenisButton==='check_nilai_bmn'){
                        this.verifikasi.check_nilai_bmn = $value
                    }
                    if($jenisButton==='check_surat_permohonan'){
                        this.verifikasi.check_surat_permohonan = $value
                    }
                    if($jenisButton==='check_rincian_usulan_bmn'){
                        this.verifikasi.check_rincian_usulan_bmn = $value
                    }
                    if($jenisButton==='check_kib'){
                        this.verifikasi.check_kib = $value
                    }
                    if($jenisButton==='check_foto_bmn'){
                        this.verifikasi.check_foto_bmn = $value
                    }
                    if($jenisButton==='check_sk_delegasi'){
                        this.verifikasi.check_sk_delegasi = $value
                    }
                    if($jenisButton==='check_dokumen_kepemilikan'){
                        this.verifikasi.check_dokumen_kepemilikan = $value
                    }
                    if($jenisButton==='check_fc_dokumen_kepemilikan'){
                        this.verifikasi.check_fc_dokumen_kepemilikan = $value
                    }
                    if($jenisButton==='check_sptjm_bermaterai'){
                        this.verifikasi.check_sptjm_bermaterai = $value
                    }
                    if($jenisButton==='check_kebenaran_fc_dokumen_kepemilikan'){
                        this.verifikasi.check_kebenaran_fc_dokumen_kepemilikan = $value
                    }

                },

                //pick
                pickStatusJabatanKasiKANWIL(statusJabatan) {

                     if(statusJabatan === this.temp_data_kepala_seksi_kanwil.status ){
                        
                           this.data_kepala_seksi_kanwil = {
                                                        jabatan : this.temp_data_kepala_seksi_kanwil.jabatan,
                                                        status : statusJabatan,
                                                        nip : this.temp_data_kepala_seksi_kanwil.nip,          
                                                        nama : this.temp_data_kepala_seksi_kanwil.nama 
                                                    }
                    }else{
                            this.data_kepala_seksi_kanwil = {
                                                        jabatan : this.temp_data_kepala_seksi_kanwil.jabatan,
                                                        status : statusJabatan,
                                                        nip : '',          
                                                        nama : '' 
                                                    }
                    }
                },
                pickStatusJabatanKabidKANWIL(statusJabatan) {

                    if(statusJabatan === this.temp_data_kepala_bidang_kanwil.status ){
                            this.data_kepala_bidang_kanwil = {
                                                       jabatan : this.temp_data_kepala_bidang_kanwil.jabatan,
                                                       status : statusJabatan,
                                                       nip : this.temp_data_kepala_bidang_kanwil.nip,          
                                                       nama : this.temp_data_kepala_bidang_kanwil.nama 
                                                    } 
                    }else{
                            this.data_kepala_bidang_kanwil = {
                                                    jabatan :this.temp_data_kepala_bidang_kanwil.jabatan,
                                                    status : statusJabatan,
                                                    nip : '',          
                                                    nama : ''}
                    }
                },  
                pickStatusJabatanKANWIL(statusJabatan) {

                    if(statusJabatan === this.temp_data_kepala_kanwil.status ){
                            this.data_kepala_kanwil = {
                                                       jabatan : this.temp_data_kepala_kanwil.jabatan,
                                                       status : statusJabatan,
                                                       nip : this.temp_data_kepala_kanwil.nip,          
                                                       nama : this.temp_data_kepala_kanwil.nama 
                                                    } 
                    }else{
                            this.data_kepala_kanwil = {
                                                    jabatan :this.temp_data_kepala_kanwil.jabatan,
                                                    status : statusJabatan,
                                                    nip : '',          
                                                    nama : ''}
                    }
                },   


                //SET
                setTempJabatanKepalaSeksiKANWIL() {
                    this.temp_data_kepala_seksi_kanwil = {
                                               jabatan : this.data_kepala_seksi_kanwil.jabatan,
                                               status : this.data_kepala_seksi_kanwil.status,
                                               nip : this.data_kepala_seksi_kanwil.nip,          
                                               nama : this.data_kepala_seksi_kanwil.nama 
                                          }

                },       
                setTempJabatanKepalaBidangKANWIL() {
                    this.temp_data_kepala_bidang_kanwil = {
                                               jabatan : this.data_kepala_bidang_kanwil.jabatan,
                                               status : this.data_kepala_bidang_kanwil.status,
                                               nip : this.data_kepala_bidang_kanwil.nip,          
                                               nama : this.data_kepala_bidang_kanwil.nama 
                                          }

                }, 

                setTempJabatanKepalaKANWIL() {
                    this.temp_data_kepala_kanwil = {
                                               jabatan : this.data_kepala_kanwil.jabatan,
                                               status : this.data_kepala_kanwil.status,
                                               nip : this.data_kepala_kanwil.nip,          
                                               nama : this.data_kepala_kanwil.nama 
                                          }

                }, 

                //GET
                getKepalaBidangKANWIL() {
                    let self = this
                    axios.get(this.url + "/theme_costume/static_content/kepala_bidang.json")
                        .then(response => {
                            self.option_data_kepala_bidang_kanwil = response.data.jabatan_kepala_bidang
                        })
                },     
                getKepalaSeksiKANWIL() {
                    let self = this
                    axios.get(this.url + "/theme_costume/static_content/kepala_seksi.json")
                        .then(response => {
                            self.option_data_kepala_seksi_kanwil = response.data.jabatan_kepala_seksi
                        })
                },
                getKepalaKANWIL() {
                    let self = this
                    axios.get(this.url + "/theme_costume/static_content/kepala_kanwil.json")
                        .then(response => {
                            self.option_data_kepala_kanwil = response.data.jabatan_kepala_kanwil
                        })
                },

                //NAME
                name_jabatan_kepala_seksi_kanwil({jabatan}) {
                    return `${jabatan}` 
                },        
                name_jabatan_kepala_bidang_kanwil({jabatan}) {
                    return `${jabatan}` 
                },      
                name_jabatan_kepala_kanwil({jabatan}) {
                    return `${jabatan}` 
                },

                
                beforeTab1SwitchKANWIL: function() {

                    let self = this
                    return this.$validator.validateAll("step1").then((result) => {
                        if (!result) {
                            alert('mohon melengkapi seluruh form diatas')
                            return false;
                        } else {
                            this.addVerifikasi("Proses by Verifikator")
                            return true
                        }

                    })
                },
                beforeTab2SwitchKANWIL: function() {
                    this.addVerifikasi("Dokumen Fisik telah Dicek")
                    return true
                },
                beforeTab3SwitchKANWIL: function() {
                    this.verifikasi.daftar_tembusan = JSON.stringify(this.daftarTembusan)
                    this.addVerifikasi("Dokumen Fisik telah Dicek")
                    return true
                },

                addVerifikasi:function(status) {
                    //Assign Kepala Seksi
                    this.verifikasi.jabatan_kepala_seksi = this.data_kepala_seksi_kanwil.jabatan
                    this.verifikasi.status_kepala_seksi = this.data_kepala_seksi_kanwil.status
                    this.verifikasi.nama_kepala_seksi = this.data_kepala_seksi_kanwil.nama
                    this.verifikasi.nip_kepala_seksi = this.data_kepala_seksi_kanwil.nip

                    //Assign Kepala Bidang
                    this.verifikasi.jabatan_kepala_bidang = this.data_kepala_bidang_kanwil.jabatan
                    this.verifikasi.status_kepala_bidang = this.data_kepala_bidang_kanwil.status
                    this.verifikasi.nama_kepala_bidang = this.data_kepala_bidang_kanwil.nama
                    this.verifikasi.nip_kepala_bidang = this.data_kepala_bidang_kanwil.nip

                    //Assign Kepala Kanwil
                    this.verifikasi.jabatan_kepala_kanwil = this.data_kepala_kanwil.jabatan
                    this.verifikasi.status_kepala_kanwil = this.data_kepala_kanwil.status
                    this.verifikasi.nama_kepala_kanwil = this.data_kepala_kanwil.nama
                    this.verifikasi.nip_kepala_kanwil = this.data_kepala_kanwil.nip

                    //setup others
                    this.verifikasi.idPengajuan = this.choosePengajuan.id
                    this.status_pengajuan = status

                    var formData = this.formData(this.verifikasi);
                    let self = this
                    if(this.verifikasi.id!=''){
                        axios.post(this.url + "/hideend/verifikasi/update", formData).then(function(response) {
                            if (response.data.error) {
                                console.log(response.data.msg);
                            } else {
                                self.updateStatusPengajuan()
                            }
                         })
                    }else{
                        axios.post(this.url + "/hideend/verifikasi/add", formData).then(function(response) {
                            if (response.data.error) {
                                console.log(response.data.msg);
                            } else {
                                self.verifikasi.id =response.data.id
                                self.updateStatusPengajuan()
                            }
                        })
                    }
                    

                },
                updateStatusPengajuan(){
                    let pengajuan= {
                                idPengajuan:this.choosePengajuan.id,
                                status_pengajuan: this.status_pengajuan
                              }
                    var formData = this.formData(pengajuan);
                    axios.post(this.url + "/hideend/pengajuan/updateStatusPengajuan", formData).then(function(response) {
                            if (!response.data.error) {
                                return true;
                            } else {
                                return false;
                            }
                        })
                },
                formData(obj) {
                    var formData = new FormData();
                    for (var key in obj) {
                        formData.append(key, obj[key]);
                    }
                    return formData;
                },

                    }
                })




// Table
Vue.component('table-verifikasi-pspbmn', {
            template: '#pspTableVerifikasiWizard',
            data() {
                 return {
                    url: 'http://localhost/pspbmn',
                    pengajuan:[],
                    emptyResult: false,
                    successMSG: '',
                    totalData:0,
                    currentPage: 0,
                    rowCountPage: 5,
                    pageRange: 2,
                    choosePengajuan:{},
                    jenisForm:{
                        'verifikasi':false,
                        'uploaddokumen':false,
                        'butuhsurvey':false,
                        'butuhkelengkapan':false,
                    },
                    
                 }

            },
            created(){
                this.showAll()
            },
            methods:{

                    
                    refresh(){
                        this.showAll(); //for preventing
                    },

                    showAll(){ 
                        let self = this
                        axios.post(this.url+"/hideend/pengajuan/showAll").then(function(response){
                                 if(response.data.pengajuan == null){
                                        self.noResult()
                                    }else{
                                        self.getData(response.data.pengajuan);
                                    }
                        })
                    },
                    getData(pengajuan){
                        this.emptyResult = false; // become false if has a record
                        this.totalData = pengajuan.length //get total of user
                        this.pengajuan = pengajuan.slice(this.currentPage * this.rowCountPage, (this.currentPage * this.rowCountPage) + this.rowCountPage); //slice the result for pagination
                        
                         // if the record is empty, go back a page
                        if(this.pengajuan.length == 0 && this.currentPage > 0){ 
                            this.pageUpdate(self.currentPage - 1)
                            this.clearAll();  
                        }
                    },
                    pageUpdate(pageNumber){
                        this.currentPage = pageNumber; //receive currentPage number came from pagination template
                        this.refresh()  
                    },
                    selectPengajuan(data){
                        this.choosePengajuan = data
                    },
                    selectJenisForm(jenisForm){
                        if(jenisForm=='verifikasi'){
                            this.jenisForm.verifikasi = true
                            this.jenisForm.uploaddokumen = false
                            this.jenisForm.butuhsurvey = false
                            this.jenisForm.butuhkelengkapan = false
                        }else if(jenisForm=='uploaddokumen'){
                            this.jenisForm.verifikasi = false
                            this.jenisForm.uploaddokumen = true
                            this.jenisForm.butuhsurvey = false
                            this.jenisForm.butuhkelengkapan = false
                        }else if(jenisForm=='butuhsurvey'){
                            this.jenisForm.verifikasi = false
                            this.jenisForm.uploaddokumen = false
                            this.jenisForm.butuhsurvey = true
                            this.jenisForm.butuhkelengkapan = false
                        }else if(jenisForm=='butuhkelengkapan'){
                            this.jenisForm.verifikasi = false
                            this.jenisForm.uploaddokumen = false
                            this.jenisForm.butuhsurvey = false
                            this.jenisForm.butuhkelengkapan = true
                        }

                    },
                    getDataChoosePengajuan(){
                         this.$emit('send-data', this.choosePengajuan)
                    },
                    getJenisForm(){
                         this.$emit('send-jenisform', this.jenisForm)
                    }

        },
        })






var v = new Vue({
    el: '#app',
    data: {
        url: 'http://localhost/pspbmn',
        verifikasi:{},
        jenisForm:{
                        'verifikasi':false,
                        'uploaddokumen':false,
                        'butuhsurvey':false,
                        'butuhkelengkapan':false,
                    },

        isShowFormKANWIL: false,
        isShowFormKPKNL: false,           

        choosePengajuan:{},
        emptyResult: false,
        successMSG: '',
        totalData:0,
        tpBtn: 0,
        isDisabled: 1,
        enableEnquiry: false,
        inputDateOne: '',
        inputDateTwo: '',
        sundayFirst: false,
        alignRight: false,
        trigger: false,
        showVerifikasiWizardForm:false,
        showTablePengajuan:true,
        areaProsesText: '',
        statusFirstSelect:false,
        jenisProses: '',
        isAdaDokumenKepemilikan: true,
        showVerifikasiWizardTable: true,
        showButtonhasilVerifikasi: true,
            daftarTembusan:[{
                            nama:''
                        }]
    },
    created() {

    },
    computed: {
        // a computed getter
        hrefFileSuratPermohon: function () {
            // `this` points to the vm instance
            return this.url+'/uploads/'+this.choosePengajuan.fileSuratPermohon
        },
        // a computed getter
        hrefFileDaftarRincian: function () {
            // `this` points to the vm instance
            return this.url+'/uploads/'+this.choosePengajuan.fileDaftarRincian
        },
        // a computed getter
        hrefFileDokumenKelengkapan: function () {
            // `this` points to the vm instance
            return this.url+'/uploads/'+this.choosePengajuan.fileDokumenKelengkapan
        }
    },
    methods: {

        finishProsesVerifikasi(value) {
            if(this.jenisProses=="KANWIL"){
                //hide FORM KANWIL
                this.isShowFormKANWIL = value.isShowFormKANWIL
            }            

            if(this.jenisProses=="KPKNL"){
                //hide FORM KPKNL
                this.isShowFormKPKNL = value.isShowFormKPKNL
            }
            this.showVerifikasiWizardForm = false
            this.showVerifikasiWizardTable = true
        },
        getJenisForm(value) {
            this.jenisForm = value
        },
        getDataChoosePengajuan(value) {
            this.choosePengajuan = value

            this.showVerifikasiWizardTable = false
            this.showVerifikasiWizardForm = true
            this.pspTableVerifikasiWizard = false
            let str = this.choosePengajuan.status_proses 
            this.getDataVerifikasi()
            if(str.includes("KPKNL")){
                 this.showVerifikasiWizardForm = true
                 this.isShowFormKPKNL = true
                 this.jenisProses = "KPKNL"
            }

            if(str.includes("KANWIL")){
                 this.showVerifikasiWizardForm = true
                 this.isShowFormKANWIL = true
                 this.jenisProses = "KANWIL"
            }           
        },
       
        getDataVerifikasi:function(){
            axios.post(this.url + "/hideend/verifikasi/checkDocumentVerifikasi/"+this.choosePengajuan.id).then(function(response) {
                 
                    if (response.data.dokumen) {
                        v.verifikasi =  response.data.dokumen[0]
                    
                    }
                })  
        },







    }
})