var datepickerOptions = {}
Vue.use(window.AirbnbStyleDatepicker, datepickerOptions)
Vue.use(VueFormWizard)
Vue.use(vuejsDatepicker)
Vue.use(VeeValidate)
Vue.config.debug = true;
Vue.use(VuejsDialog.main.default)
Vue.use(VMoney)
Vue.use(VueMultiselect)
Vue.component('vue-multiselect', window.VueMultiselect.default)

//dynamic url
let myUrl = window.location.origin+"/";

if(myUrl.includes("localhost")){
  var pathArray = window.location.pathname.split( '/' );
  myUrl += pathArray [1] + "/";
}



// Table
formRekapPotongan = {
            template: '#formRekapPotongan',
            props: ['jenispotongan'],            
            components: {
                    vuejsDatepicker
            },
            data() {
                 return {
                    url: myUrl,
                    potongan:{
                        detailpegawai:"",
                        periode_gaji:"",
                        jenis_gaji:"",
                        nominal:"",
                    },
                    rekapPotongan:[],
                    sendRekapPotongan:[],
                    option_detail_pegawai:[],
                    rekap:[],
                    emptyResult: false,
                    successMSG: '',
                    totalData:0,
                    currentPage: 0,
                    rowCountPage: 5,
                    pageRange: 2,
                    choosePenggajian:{},
                    isShowFinish:false,
                    money: {
                        decimal: ',',
                        thousands: '.',
                        prefix: 'Rp ',
                        suffix: '',
                        precision: 0,
                        masked: false /* doesn't work with directive */
                      },
                    jenis_gaji_obj:{  
                                    id:"1",
                                    keterangan:"Gaji Bulanan Reguler",
                                    nama:"Bulanan"},
                   option_jenis_gaji: [],
                    
                 }

            },
            created(){
                this.showAll()
                this.getDetailPegawai()
                this.getJenisGaji()
                this.set_jenis_gaji()
            },
            methods:{

                sendEmailGaji(id){
                        if (typeof id === "undefined"){
                            id=""
                        }
                        let self = this
                        axios.post(this.url+"/hideend/penggajian/sendEmailGaji/"+id).then(function(response){
                                 if(response.data.kirim === "error"){
                                        console.log("error kirim email")
                                    }else{
                                       console.log("Sukses Kirim")
                                    }
                        })

                },
                set_jenis_gaji() {
                    this.potongan.jenis_gaji = this.jenis_gaji_obj.id
                },
                jenis_gaji_fn({nama}) {

                    return `${nama}`
                },

                    getJenisGaji() {
                        let self = this
                        axios.post(this.url+"/hideend/penggajian/showJenisGaji").then(function(response){
                            self.option_jenis_gaji = response.data.jenisGaji
                        })
                    },
                    formData(obj) {
                        var formData = new FormData();
                        for (var key in obj) {
                            formData.append(key, obj[key]);
                        }
                        return formData;
                    },
                    finishPotonganData(){
                        let self = this;
                        this.sendRekapPotongan = this.rekapPotongan.map(function(obj){
                               var result= {
                                id_pegawai: obj.id_pegawai,
                                pendapatan: obj.pendapatan,
                                [obj.jenis_potongan]:obj.nominal,
                                jenis_gaji:obj.jenis_gaji,
                                periode_gaji:obj.periode_gaji,
                                kopri_dw:obj.detailpegawai.kopri_dw,
                                suka_duka:obj.detailpegawai.suka_duka,
                                simp_voucher:obj.detailpegawai.simp_voucher,
                                kopri_dw:obj.detailpegawai.kopri_dw,
                                suka_duka:obj.detailpegawai.suka_duka,
                                simp_voucher:obj.detailpegawai.simp_voucher,
                                sendemail:0,
                                email:obj.detailpegawai.email
                            }
                            return result;
                        })

                        let dataArray = {
                                data:JSON.stringify(this.sendRekapPotongan)
                            }
                        let formData  = this.formData(dataArray)   
                        axios.post(this.url + "/hideend/penggajian/update_potongan", formData).then(function(response) {
                            if (response.data.error) {
                                self.$dialog.alert(response.data.msg).then(function(dialog) {
                                  console.log('Closed');
                                });
                            } else {
                                self.clearRekapTable();                                   
                            }
                        })
                    },
                    clearRekapTable(){
                         this.rekapPotongan = []
                         this.cekEmptyArray()
                    },
                    cekEmptyArray(){
                        this.isShowFinish = (this.rekapPotongan.length>0)?true:false
                    },
                    deleteRekap(index){
                        this.rekapPotongan.splice(index, 1)
                        this.cekEmptyArray()
                    },
                    savePotonganData(){

                        let arrayRekap = {
                                "id_pegawai" :this.potongan.detailpegawai.id,
                                "nama" :this.potongan.detailpegawai.nama,
                                "detailpegawai" :this.potongan.detailpegawai,
                                "jenis_gaji" :this.potongan.jenis_gaji,
                                "jenis_potongan" :this.jenispotongan,
                                "periode_gaji" :this.potongan.periode_gaji,
                                "nominal" :this.potongan.nominal,
                                "pendapatan" :(this.jenis_gaji==1||this.jenis_gaji==3||this.jenis_gaji==5)?this.potongan.detailpegawai.gaji_pokok:this.potongan.detailpegawai.tunjangan_jabatan
                        }

                        if(this.potongan.nominal<=0||this.potongan.detailpegawai===""){

                            this.$dialog.alert("Mohon di cek nilai inputan").then(function(dialog) {
                                  console.log('Closed');
                                });
                        }else{
                                 ///cek DISINIxx 
                            found = this.rekapPotongan.some(el => el.id_pegawai === arrayRekap.id_pegawai);
                            if(!found){
                                this.rekapPotongan.push(arrayRekap)
                            }

                            this.cekEmptyArray()

                        }

                       
                    },
                    getDetailPegawai() {
                        let self = this
                        this.potongan.periode_gaji =moment().subtract(1, 'months').format('YYYY-MM-01')
                        axios.post(this.url+"/hideend/penggajian/showPegawai").then(function(response){
                            self.option_detail_pegawai = response.data.pegawai
                            
                        })
                       
                    },
                    name_pegawai({nama}) {
                       return `${nama}`
                    },
                    downloadGaji(data) {
                        let self = this
                        let url
                        axios.post(this.url+"/hideend/penggajian/rekap_download/"+data.periode_gaji + "/" +data.jenis_gaji).then(function(response){
                                  console.log(response.data.rekap)
                                 if(response.data.rekap.status !== 0){
                                        url = myUrl + response.data.rekap.filepath;
                                        nama = response.data.rekap.namafile;
                                        self.forceFileDownload(url,nama)
                                        
                                    }else{
                                        console.log("error show all")
                                    }
                        })
                        
                        
                    },    

                    forceFileDownload(url,namafile){
                        //const url = window.URL.createObjectURL(new Blob([response.data]))

                        const link = document.createElement('a')
                        link.href = url
                        link.setAttribute('download', namafile) //or any other extension
                        document.body.appendChild(link)
                        link.click()
                    },               
                    formatPrice(value) {
                        let val = (value/1).toFixed(0).replace('.', ',')
                        return "Rp " + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                    },
                    customFormatter(date) {
                        return moment(date).format('MMMM YYYY');
                    }, 
                    gotoEditData(id){
                        window.location.href = myUrl + 'hideend/penggajian/index/'+id;  
                    },
                    refresh(){
                        this.showAll(); //for preventing
                    },
                    showAll(id){
                        if (typeof id === "undefined"){
                            id=""
                        }

                    },
                    getData(value){
                        this.emptyResult = false; // become false if has a record
                        this.totalData = value.length //get total of user
                        this.rekap = value.slice(this.currentPage * this.rowCountPage, (this.currentPage * this.rowCountPage) + this.rowCountPage); //slice the result for pagination
                        
                         // if the record is empty, go back a page
                        if(this.rekap.length == 0 && this.currentPage > 0){ 
                            this.pageUpdate(self.currentPage - 1)
                            this.clearAll();  
                        }
                    },
                    pageUpdate(pageNumber){
                        this.currentPage = pageNumber; //receive currentPage number came from pagination template
                        this.refresh()  
                    },
                    selectpenggajian(data){
                        this.choosePenggajian = data
                    },
                    selectJenisForm(jenisForm){
                        if(jenisForm==='verifikasi'){
                            this.jenisForm.verifikasi = true
                            this.jenisForm.uploaddokumen = false
                            this.jenisForm.butuhsurvey = false
                            this.jenisForm.butuhkelengkapan = false
                        }

                    },
                    getDatachoosePenggajian(){
                         this.$emit('send-data', this.choosePenggajian)
                    },
                    getJenisForm(){
                         this.$emit('send-jenisform', this.jenisForm)
                    }

        },
        }
tableRekapPenggajian = {
            template: '#rekapPenggajianTable',
            data() {
                 return {
                    url: myUrl,
                    rekap:[],
                    emptyResult: false,
                    successMSG: '',
                    totalData:0,
                    currentPage: 0,
                    rowCountPage: 5,
                    pageRange: 2,
                    choosePenggajian:{},
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
                    downloadStruk(data) {
                        let self = this
                        let url

                        axios.post(this.url+"/hideend/penggajian/struk_download/"+data.periode_gaji + "/" +data.jenis_gaji).then(function(response){
                                  console.log(response.data)
                                 if(response.data.struk.status !== 0){
                                        url = myUrl + response.data.struk.filepath;
                                        nama = response.data.struk.namafile;
                                        self.forceFileDownload(url,nama)
                                        
                                    }else{
                                        console.log("error show all")
                                    }
                        })
                        
                        
                    },    

                    downloadGaji(data) {
                        let self = this
                        let url
                        axios.post(this.url+"/hideend/penggajian/rekap_download/"+data.periode_gaji + "/" +data.jenis_gaji).then(function(response){
                                  console.log(response.data.rekap)
                                 if(response.data.rekap.status !== 0){
                                        url = myUrl + response.data.rekap.filepath;
                                        nama = response.data.rekap.namafile;
                                        self.forceFileDownload(url,nama)
                                        
                                    }else{
                                        console.log("error show all")
                                    }
                        })
                        
                        
                    },    

                    forceFileDownload(url,namafile){
                        //const url = window.URL.createObjectURL(new Blob([response.data]))

                        const link = document.createElement('a')
                        link.href = url
                        link.setAttribute('download', namafile) //or any other extension
                        document.body.appendChild(link)
                        link.click()
                    },               
                    formatPrice(value) {
                        let val = (value/1).toFixed(0).replace('.', ',')
                        return "Rp " + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                    },
                    customFormatter(date) {
                        return moment(date).format('MMMM YYYY');
                    }, 
                    gotoEditData(id){
                        window.location.href = myUrl + 'hideend/penggajian/index/'+id;  
                    },
                    refresh(){
                        this.showAll(); //for preventing
                    },
                    showAll(id){
                        if (typeof id === "undefined"){
                            id=""
                        }
                        let self = this
                        axios.post(this.url+"/hideend/penggajian/rekap/"+id).then(function(response){
                                 if(response.data.rekap == null){
                                        self.rekap={}    
                                        console.log("error show all")
                                    }else{
                                        self.getData(response.data.rekap);
                                    }
                        })
                    },
                    getData(value){
                        this.emptyResult = false; // become false if has a record
                        this.totalData = value.length //get total of user
                        this.rekap = value.slice(this.currentPage * this.rowCountPage, (this.currentPage * this.rowCountPage) + this.rowCountPage); //slice the result for pagination
                        
                         // if the record is empty, go back a page
                        if(this.rekap.length == 0 && this.currentPage > 0){ 
                            this.pageUpdate(self.currentPage - 1)
                            this.clearAll();  
                        }
                    },
                    pageUpdate(pageNumber){
                        this.currentPage = pageNumber; //receive currentPage number came from pagination template
                        this.refresh()  
                    },
                    selectpenggajian(data){
                        this.choosePenggajian = data
                    },
                    selectJenisForm(jenisForm){
                        if(jenisForm==='verifikasi'){
                            this.jenisForm.verifikasi = true
                            this.jenisForm.uploaddokumen = false
                            this.jenisForm.butuhsurvey = false
                            this.jenisForm.butuhkelengkapan = false
                        }

                    },
                    getDatachoosePenggajian(){
                         this.$emit('send-data', this.choosePenggajian)
                    },
                    getJenisForm(){
                         this.$emit('send-jenisform', this.jenisForm)
                    }

        },
        }

// Table
tablePenggajian = {
            template: '#penggajianTable',
            data() {
                 return {
                    url: myUrl,
                    penggajian:[],
                    emptyResult: false,
                    successMSG: '',
                    totalData:0,
                    currentPage: 0,
                    rowCountPage: 5,
                    pageRange: 2,
                    choosePenggajian:{},
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

                    downloadStruk(data) {
                        let self = this
                        let url

                        axios.post(this.url+"/hideend/penggajian/struk_download/"+data.periode_gaji + "/" +data.jenis_gaji + "/" + data.id_pegawai).then(function(response){
                                  console.log(response.data)
                                 if(response.data.struk.status !== 0){
                                        url = myUrl + response.data.struk.filepath;
                                        nama = response.data.struk.namafile;
                                        self.forceFileDownload(url,nama)
                                        
                                    }else{
                                        console.log("error show all")
                                    }
                        })
                        
                        
                    },    

                    forceFileDownload(url,namafile){
                        //const url = window.URL.createObjectURL(new Blob([response.data]))

                        const link = document.createElement('a')
                        link.href = url
                        link.setAttribute('download', namafile) //or any other extension
                        document.body.appendChild(link)
                        link.click()
                    },       
                    sendEmailGaji(id){

                        if (typeof id === "undefined"){
                            id=""
                        }
                        let self = this
                        axios.post(this.url+"/hideend/penggajian/sendEmailGaji/"+id).then(function(response){
                                 if(response.data.kirim === "error"){
                                        console.log("error kirim email")
                                    }else{
                                       console.log("Sukses Kirim")
                                    }
                        })

                    },
                    getSisaPendapatan(data){
                        let sisapendapatan = parseInt(data.pendapatan) - (parseInt(data.kopri_dw) + parseInt(data.bpd_gianyar) + parseInt(data.bpd_ubud) + parseInt(data.bpd_tampaksiring)+ parseInt(data.bpd_sukawati) + parseInt(data.kop_melati) + parseInt(data.suka_duka) + parseInt(data.simp_voucher) + parseInt(data.cicilan_barang) + parseInt(data.pinjaman_koperasi) + parseInt(data.arisan_dw) + parseInt(data.werdhi_sedana) + parseInt(data.santunan_meninggal) + parseInt(data.pinjaman_kop_naker) + parseInt(data.simpanan_kop_naker) + parseInt(data.tabungan_mesra) + parseInt(data.bpr_kanti) + parseInt(data.kop_sinar))
                        return this.formatPrice(sisapendapatan)
                    },
                    getTotalPotongan(data){
                        console.log("data potongan")
                        
                        let totalpotongan = parseInt(data.kopri_dw) + parseInt(data.bpd_gianyar) + parseInt(data.bpd_ubud) + parseInt(data.bpd_tampaksiring)+ parseInt(data.bpd_sukawati) + parseInt(data.kop_melati) + parseInt(data.suka_duka) + parseInt(data.simp_voucher) + parseInt(data.cicilan_barang) + parseInt(data.pinjaman_koperasi) + parseInt(data.arisan_dw) + parseInt(data.werdhi_sedana) + parseInt(data.santunan_meninggal) + parseInt(data.pinjaman_kop_naker) + parseInt(data.simpanan_kop_naker) + parseInt(data.tabungan_mesra) + parseInt(data.bpr_kanti) + parseInt(data.kop_sinar)
                        console.log(totalpotongan )
                        return this.formatPrice(totalpotongan)
                    },
                    formatPrice(value) {
                        let val = (value/1).toFixed(0).replace('.', ',')
                        return "Rp " + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                    },

                    customFormatter(date) {
                        return moment(date).format('MMMM YYYY');
                    }, 
                    gotoEditData(id){
                        window.location.href = myUrl + 'hideend/penggajian/index/'+id;  
                    },
                    refresh(){
                        this.showAll(); //for preventing
                    },
                    showAll(){ 
                        let self = this
                        axios.post(this.url+"/hideend/penggajian/showAll").then(function(response){
                                 if(response.data.penggajian == null){
                                        console.log("error show all")
                                    }else{
                                        self.getData(response.data.penggajian);
                                    }
                        })
                    },
                    getData(penggajian){
                        this.emptyResult = false; // become false if has a record
                        this.totalData = penggajian.length //get total of user
                        this.penggajian = penggajian.slice(this.currentPage * this.rowCountPage, (this.currentPage * this.rowCountPage) + this.rowCountPage); //slice the result for pagination
                        
                         // if the record is empty, go back a page
                        if(this.penggajian.length == 0 && this.currentPage > 0){ 
                            this.pageUpdate(self.currentPage - 1)
                            this.clearAll();  
                        }
                    },
                    pageUpdate(pageNumber){
                        this.currentPage = pageNumber; //receive currentPage number came from pagination template
                        this.refresh()  
                    },
                    selectpenggajian(data){
                        this.choosePenggajian = data
                    },
                    selectJenisForm(jenisForm){
                        if(jenisForm==='verifikasi'){
                            this.jenisForm.verifikasi = true
                            this.jenisForm.uploaddokumen = false
                            this.jenisForm.butuhsurvey = false
                            this.jenisForm.butuhkelengkapan = false
                        }

                    },
                    getDatachoosePenggajian(){
                         this.$emit('send-data', this.choosePenggajian)
                    },
                    getJenisForm(){
                         this.$emit('send-jenisform', this.jenisForm)
                    }

        },
        }



detailPenggajian =  {
            template: '#penggajianForm',
            props: ['datapenggajian'],
            components: {
                    vuejsDatepicker
            },
            data() {
                 return {
                    url: myUrl,
                    choosePenggajian:this.datapenggajian,          
                    showDocumentVerifikasiFinal:false,         
                    showDocumentKekuranganFinal:false,         
                    showDocumentSurveyFinal:false,    
                    styleback:"background-color: green; border-color: green; color: white",    
                    stepIndex:0,         
                    penggajian:{
                                total_potongan:0,
                                sisa_pendapatan:0,
                                arisan_dw:0,
                                bpd_gianyar:0,
                                bpd_ubud:0,
                                bpd_tampaksiring:0,
                                bpd_sukawati:0,
                                potongan_lain:0,
                                bpr_kanti:0,
                                cicilan_barang:0,
                                created_at:0,
                                pendapatan:0,
                                golongan:"",
                                id:"",
                                id_pegawai:"",
                                idrekap:"",
                                jabatan:"",
                                kop_melati:0,
                                kop_sinar:0,
                                kopri_dw:0,
                                nama:"",
                                periode_gaji:"",
                                pinjaman_kop_naker:0,
                                pinjaman_koperasi:0,
                                potongan:0,
                                rekening:"",
                                santunan_meninggal:0,
                                simp_voucher:0,
                                simpanan_kop_naker:0,
                                sisa_gaji:0,
                                suka_duka:0,
                                tabungan_mesra:0,
                                werdhi_sedana:0,
                                is_saveschema:0,
                                schemaJSON:'',
                                detailpegawai:null,
                                jenis_gaji:0,  
                                jenis_gaji_obj:{  
                                        id:"1",
                                        keterangan:"Gaji Bulanan Reguler",
                                         nama:"Bulanan"}

                    },
                    date: {
                        from: null,
                        to: null,
                        month: null,
                        year: null
                    },    
                    label_jenis_gaji:"",
                    isNegatif: false,
                    money: {
                        decimal: ',',
                        thousands: '.',
                        prefix: 'Rp ',
                        suffix: '',
                        precision: 0,
                        masked: false /* doesn't work with directive */
                      },
                    datepicker:"",
                    option_detail_pegawai: [],
                    option_jenis_gaji: [],
                    isEditForm:false,
                    isSaveNext:0,
                    isGajiPokok:0
                    
                    
                }

            },      
            created(){
                this.cekEditorAdd()
                this.setPenggajian()                                
                this.getJenisGaji()
                this.getPendapatan()
                this.getDetailPegawai()
                
            },      
            computed:{


               valSisa() {
                            this.penggajian.total_potongan = (
                                                                this.penggajian.kopri_dw + 
                                                                this.penggajian.bpd_gianyar + 
                                                                this.penggajian.bpd_ubud + 
                                                                this.penggajian.bpd_tampaksiring + 
                                                                this.penggajian.bpd_sukawati + 
                                                                this.penggajian.potongan_lain +  
                                                                this.penggajian.kop_melati + 
                                                                this.penggajian.suka_duka + 
                                                                this.penggajian.simp_voucher + 
                                                                this.penggajian.cicilan_barang + 
                                                                this.penggajian.pinjaman_koperasi + 
                                                                this.penggajian.arisan_dw + 
                                                                this.penggajian.werdhi_sedana + 
                                                                this.penggajian.santunan_meninggal + 
                                                                this.penggajian.pinjaman_kop_naker + 
                                                                this.penggajian.simpanan_kop_naker + 
                                                                this.penggajian.tabungan_mesra + 
                                                                this.penggajian.bpr_kanti + 
                                                                this.penggajian.kop_sinar)
                            this.penggajian.sisa_pendapatan = this.penggajian.pendapatan - this.penggajian.total_potongan    

                            if (this.penggajian.sisa_pendapatan<0){
                                this.isNegatif = true
                            }else{
                                this.isNegatif = false
                            }
                            return this.penggajian.sisa_pendapatan;
                        },
            },
            mounted ()  {
                 let el = this.$el.getElementsByClassName("multiselect")[0];  
                  if (el) {  
                    el.tabIndex = 0;  
                  }  
                
            },
            methods:{
                focusName(){
                     this.$refs.namaPegawai.$el.focus()
                    // //console.log(this.$refs.namaPegawai)
                    //  if(!this.isEditForm){
                    //     this.$refs.namaPegawai2.$el.focus()
                    // }
                },
                clearPotongan(){
                        this.penggajian.kopri_dw = 0
                        this.penggajian.bpd_gianyar = 0
                        this.penggajian.bpd_ubud = 0
                        this.penggajian.bpd_tampaksiring = 0
                        this.penggajian.bpd_sukawati = 0
                        this.penggajian.potongan_lain = 0
                        this.penggajian.kop_melati = 0
                        this.penggajian.suka_duka = 0
                        this.penggajian.simp_voucher = 0
                        this.penggajian.cicilan_barang = 0
                        this.penggajian.pinjaman_koperasi = 0
                        this.penggajian.arisan_dw = 0
                        this.penggajian.werdhi_sedana = 0
                        this.penggajian.santunan_meninggal = 0
                        this.penggajian.pinjaman_kop_naker = 0
                        this.penggajian.simpanan_kop_naker = 0
                        this.penggajian.tabungan_mesra = 0
                        this.penggajian.bpr_kanti = 0
                        this.penggajian.kop_sinar = 0
                        //this.penggajian.is_saveschema = 1

                },
                set_jenis_gaji(){
                    this.label_jenis_gaji = this.penggajian.jenis_gaji_obj.nama
                },
                getPendapatan(){
                    let jenisGajiObj = this.penggajian.jenis_gaji_obj
                    if(jenisGajiObj.id === "1" || jenisGajiObj.id === "3" || jenisGajiObj.id === "5"){
                        this.penggajian.pendapatan =  this.penggajian.gaji_pokok
                        this.isGajiPokok = 1
                    }

                    if(jenisGajiObj.id === "2" || jenisGajiObj.id === "4" ){
                        this.penggajian.pendapatan =  this.penggajian.tunjangan_jabatan
                        this.isGajiPokok = 0
                    }
                },
                setPotonganForm(){
                     this.clearPotongan()
                     this.penggajian.golongan = this.penggajian.detailpegawai.golongan
                     this.penggajian.jabatan = this.penggajian.detailpegawai.jabatan
                     this.penggajian.id_pegawai = this.penggajian.detailpegawai.id
                     this.penggajian.gaji_pokok = this.penggajian.detailpegawai.gaji_pokok
                     this.penggajian.tunjangan_jabatan = this.penggajian.detailpegawai.tunjangan_jabatan

                     if(this.penggajian.detailpegawai.schemaJSON!=="" || this.penggajian.detailpegawai.schemaJSON.length!==0){
                        let detail_schema = JSON.parse(this.penggajian.detailpegawai.schemaJSON)

                        console.log(detail_schema)

                        this.penggajian.kopri_dw = detail_schema.kopri_dw
                        this.penggajian.bpd_gianyar = detail_schema.bpd_gianyar
                        this.penggajian.bpd_ubud = detail_schema.bpd_ubud
                        this.penggajian.bpd_tampaksiring = detail_schema.bpd_tampaksiring
                        this.penggajian.bpd_sukawati = detail_schema.bpd_sukawati
                        this.penggajian.potongan_lain = detail_schema.potongan_lain
                        this.penggajian.kop_melati = detail_schema.kop_melati
                        this.penggajian.suka_duka = detail_schema.suka_duka
                        this.penggajian.simp_voucher = detail_schema.simp_voucher
                        this.penggajian.cicilan_barang = detail_schema.cicilan_barang
                        this.penggajian.pinjaman_koperasi = detail_schema.pinjaman_koperasi
                        this.penggajian.arisan_dw = detail_schema.arisan_dw
                        this.penggajian.werdhi_sedana = detail_schema.werdhi_sedana
                        this.penggajian.santunan_meninggal = detail_schema.santunan_meninggal
                        this.penggajian.pinjaman_kop_naker = detail_schema.pinjaman_kop_naker
                        this.penggajian.simpanan_kop_naker = detail_schema.simpanan_kop_naker
                        this.penggajian.tabungan_mesra = detail_schema.tabungan_mesra
                        this.penggajian.bpr_kanti = detail_schema.bpr_kanti
                        this.penggajian.kop_sinar = detail_schema.kop_sinar
                        this.penggajian.is_saveschema =parseFloat(detail_schema.is_saveschema)


                     }

                },
                cekEditorAdd(){
                    if(typeof this.datapenggajian !== 'undefined'){
                        this.isEditForm = true 
                    }else{
                        this.label_jenis_gaji = this.penggajian.jenis_gaji_obj.nama
                    }
                },
                jenis_gaji_fn({nama}) {

                    return `${nama}`
                },
                name_pegawai({nama}) {

                    return `${nama}`
                },
                getJenisGaji() {
                    let self = this
                    axios.post(this.url+"/hideend/penggajian/showJenisGaji").then(function(response){
                        self.option_jenis_gaji = response.data.jenisGaji
                    })
                },
                getDetailPegawai() {
                    let self = this
                    axios.post(this.url+"/hideend/penggajian/showPegawai").then(function(response){
                        self.option_detail_pegawai = response.data.pegawai
                        
                    })
                   
                },
                formData(obj) {
                    var formData = new FormData();
                    for (var key in obj) {
                        formData.append(key, obj[key]);
                    }
                    return formData;
                },
                customFormatter(date) {
                    return moment(date).format('MMMM YYYY');
                },   
                showDate (date) {
                   this.date = date
                },
                backtoTable(){
                    let valueHide ={
                                    showPenggajianDetail : false,                               
                                    showPenggajianTable : true                                    
                                }
                    this.$emit('back-data', valueHide)
                },
                setPenggajian(){
                    this.penggajian.periode_gaji =moment().subtract(1, 'months').format('YYYY-MM-01')
                    if(this.isEditForm){                        
                        if (typeof this.datapenggajian !== 'undefined'){
                            this.penggajian = this.datapenggajian
                            this.penggajian.is_saveschema = parseFloat(this.datapenggajian.is_saveschema)
                            console.log('masuk')
                            this.penggajian.jenis_gaji_obj = JSON.parse(this.datapenggajian.jenis_gaji_obj)
                            
                            this.label_jenis_gaji = this.penggajian.jenis_gaji_obj.nama
                            
                        }
                    }
                   
                },

                finishPenggajian() {

                    this.penggajian.periode_gaji = moment(this.penggajian.periode_gaji).format('YYYY-MM-01')
                    this.penggajian.is_saveschema = (this.penggajian.is_saveschema)?1:0;
                    if(parseFloat(this.penggajian.is_saveschema)){
                        this.penggajian.schemaJSON = ""
                        let saveSchemaJSON = {}
                        saveSchemaJSON.kopri_dw = this.penggajian.kopri_dw
                        saveSchemaJSON.bpd_gianyar = this.penggajian.bpd_gianyar
                        saveSchemaJSON.bpd_ubud = this.penggajian.bpd_ubud
                        saveSchemaJSON.bpd_tampaksiring = this.penggajian.bpd_tampaksiring
                        saveSchemaJSON.bpd_sukawati = this.penggajian.bpd_sukawati
                        saveSchemaJSON.potongan_lain = this.penggajian.potongan_lain
                        saveSchemaJSON.kop_melati = this.penggajian.kop_melati
                        saveSchemaJSON.suka_duka = this.penggajian.suka_duka
                        saveSchemaJSON.simp_voucher = this.penggajian.simp_voucher
                        saveSchemaJSON.cicilan_barang = this.penggajian.cicilan_barang
                        saveSchemaJSON.pinjaman_koperasi = this.penggajian.pinjaman_koperasi
                        saveSchemaJSON.arisan_dw = this.penggajian.arisan_dw
                        saveSchemaJSON.werdhi_sedana = this.penggajian.werdhi_sedana
                        saveSchemaJSON.santunan_meninggal = this.penggajian.santunan_meninggal
                        saveSchemaJSON.pinjaman_kop_naker = this.penggajian.pinjaman_kop_naker
                        saveSchemaJSON.simpanan_kop_naker = this.penggajian.simpanan_kop_naker
                        saveSchemaJSON.tabungan_mesra = this.penggajian.tabungan_mesra
                        saveSchemaJSON.bpr_kanti = this.penggajian.bpr_kanti
                        saveSchemaJSON.kop_sinar = this.penggajian.kop_sinar
                        saveSchemaJSON.is_saveschema =parseFloat(this.penggajian.is_saveschema)
                        console.log(saveSchemaJSON)

                        this.penggajian.schemaJSON =  JSON.stringify(saveSchemaJSON)
                    }
                    this.penggajian.jenis_gaji = this.penggajian.jenis_gaji_obj.id
                    if(typeof this.penggajian.jenis_gaji_obj != 'string' ){
                        this.penggajian.jenis_gaji_obj = JSON.stringify(this.penggajian.jenis_gaji_obj)
                    }
                    

                    if(typeof this.datapenggajian!=='undefined'){
                       this.updateData()
                    }else{
                        this.addData()
                    }


                },
                updateData(){
                    let self = this;
                    var formData = this.formData(this.penggajian);
                    axios.post(this.url + "/hideend/penggajian/update", formData).then(function(response) {
                        if (response.data.error) {
                            self.$dialog.alert(response.data.msg).then(function(dialog) {
                              console.log('Closed');
                            });
                        } else {
                            self.$dialog.alert(response.data.msg).then(function(dialog) {
                              console.log('Closed');
                            });                         
                            self.backtoTable()
                        }
                    })
                },
                addData(){
                    let self = this;
                    var formData = this.formData(this.penggajian);
                    axios.post(this.url + "/hideend/penggajian/insert", formData).then(function(response) {

                            self.penggajian.jenis_gaji_obj = JSON.parse(self.penggajian.jenis_gaji_obj)
                        if (response.data.error) {
                            self.$dialog.alert(response.data.msg).then(function(dialog) {
                              console.log('gagal');
                            });
                        } else {
                            self.$dialog.alert(response.data.msg).then(function(dialog) {
                              console.log('sukses');
                              self.backtoTable()
                            });  
                        }
                    })
                },
                clearPenggajianData() {
                    this.resetTab()
                    window.location.href = myUrl + 'hideend/pengajuan/status';
                },
                resetTab() {

                   this.$refs.vuewizard.reset()
                   this.errors.clear()
                },
                finishVerifikasiProses(){
                    this.isShowUploadWizardForm = false;
                    this.isShowVerifikasiForm = false;
                    let valueHide ={
                                    isShowFormKANWIL : false                                    
                                }
                    this.$emit('send-data', valueHide)
                },
                beforeTab4SwitchKANWIL: function() {

                    return true
                },
                beforeTab1Switch: function() {

                    return true
                }

        },
    }





var v = new Vue({
    el: '#app',
    components: {
        'table-rekapgaji': tableRekapPenggajian,
        'table-penggajian': tablePenggajian,
        'detail-penggajian':detailPenggajian,
        'rekap-potongan':formRekapPotongan,
        vuejsDatepicker
    },
    data: {
        url: myUrl,
        verifikasi:{},
        jenisForm:{
                        'verifikasi':false,
                        'uploaddokumen':false,
                        'butuhsurvey':false,
                        'butuhkelengkapan':false,
                    },

        isShowFormKANWIL: false,
        isShowFormKPKNL: false,           
        indexFormWizard:0,
        choosePenggajian:{},
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
        showPenggajianDetail: false,
        showPenggajianTable: true,
        jenis_potongan:"bpd_gianyar",
        textJenis:"BPD Gianyar"
    },

    methods: {
        sendEmailGaji(){
            this.$refs.tablePenggajian.sendEmailGaji()
        },
        showPotongan(jenis_potongan,textJenis){
            this.$refs.formRekapPotong.clearRekapTable()
            this.jenis_potongan = jenis_potongan
            this.textJenis = textJenis

        },
        getRekapbyJenis(idjenis) {

            
            this.$refs.tableRekapPenggajian.showAll(idjenis)
        },
        getIndexFormStep(data) {
            console.log("getIndexFormStep")
            console.log(data.step+1)            
            console.log("---getIndexFormStep")
            this.indexFormWizard = data.step+1
        },
        backtoTable(value){
            this.showPenggajianDetail = value.showPenggajianDetail
            this.showPenggajianTable = value.showPenggajianTable

        },
        finishProsesVerifikasi(value) {
            this.showPenggajianDetail = value.showPenggajianDetail
            this.showPenggajianTable = value.showPenggajianTable
        },
        getJenisForm(value) {
            this.jenisForm = value
        },
        getDatachoosePenggajian(value) {
            this.choosePenggajian = value
            this.showPenggajianDetail = true
            this.showPenggajianTable = false
           
        },
       
        getDataVerifikasi:function(){
            axios.post(this.url + "/hideend/verifikasi/checkDocumentVerifikasi/"+this.choosePenggajian.id).then(function(response) {                 
                    if (response.data.dokumen) {
                        v.verifikasi =  response.data.dokumen[0]
                    
                    }
                })  
        },







    }
})