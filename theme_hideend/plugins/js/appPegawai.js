var datepickerOptions = {}
Vue.use(window.AirbnbStyleDatepicker, datepickerOptions)
Vue.use(VueFormWizard)
Vue.use(vuejsDatepicker)

Vue.use(VeeValidate)
Vue.config.debug = true;

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
tablePegawai = {
            template: '#pegawaiTable',
            data() {
                 return {
                    url: myUrl,
                    pegawai:[],
                    emptyResult: false,
                    successMSG: '',
                    totalData:0,
                    currentPage: 0,
                    rowCountPage: 5,
                    pageRange: 2,
                    choosePegawai:{},
                    jenisForm:{
                        'verifikasi':false,
                        'uploaddokumen':false,
                        'butuhsurvey':false,
                        'butuhkelengkapan':false,
                    },
                    textSearch:""
                    
                 }

            },
            created(){
                this.showAll()
            },
            methods:{
                    //START SEARCH
                    refresh(){
                        this.showAll(this.textSearch); //for preventing
                    },
                    showAll(textSearch){    
                        if(typeof textSearch === "undefined"){
                            this.textSearch = ""
                        }else{
                            this.textSearch = textSearch
                        }

                        console.log(textSearch)
                        let self = this
                        axios.post(this.url+"/hideend/pegawai/showAll/"+this.textSearch).then(function(response){
                                 if(response.data.pegawai == null){
                                        self.pegawai = []
                                        console.log("error show all")
                                    }else{
                                        self.getData(response.data.pegawai);
                                    }
                        })
                    },
                    getData(pegawai){
                        this.emptyResult = false; // become false if has a record
                        this.totalData = pegawai.length //get total of user
                        this.pegawai = pegawai.slice(this.currentPage * this.rowCountPage, (this.currentPage * this.rowCountPage) + this.rowCountPage); //slice the result for pagination
                        
                         // if the record is empty, go back a page
                        if(this.pegawai.length == 0 && this.currentPage > 0){ 
                            console.log("if the record is empty, go back a page")
                            this.pageUpdate(self.currentPage - 1)
                            this.clearAll();  
                        }
                    },
                    pageUpdate(pageNumber){
                        this.currentPage = pageNumber; //receive currentPage number came from pagination template
                        this.refresh()  
                    },//END SEARCH
                    customFormatter(date) {
                        return moment(date).format('MMMM YYYY');
                    }, 
                    gotoEditData(id){
                        window.location.href = myUrl + 'hideend/pegawai/index/'+id;  
                    },
                    selectpegawai(data){
                        this.choosePegawai = data
                    },
                    selectJenisForm(jenisForm){
                        if(jenisForm==='verifikasi'){
                            this.jenisForm.verifikasi = true
                            this.jenisForm.uploaddokumen = false
                            this.jenisForm.butuhsurvey = false
                            this.jenisForm.butuhkelengkapan = false
                        }

                    },
                    getDatachoosePegawai(){
                         this.$emit('send-data', this.choosePegawai)
                    },
                    getJenisForm(){
                         this.$emit('send-jenisform', this.jenisForm)
                    }

        },
        }



detailPegawai =  {
            template: '#pegawaiForm',
            props: ['datapegawai'],
            components: {
                    vuejsDatepicker
            },
            data() {
                 return {
                    url: myUrl,
                    choosePegawai:this.datapegawai,          
                    showDocumentVerifikasiFinal:false,         
                    showDocumentKekuranganFinal:false,         
                    showDocumentSurveyFinal:false,    
                    styleback:"background-color: green; border-color: green; color: white",    
                    stepIndex:0,         
                    pegawai:{
                                total_potongan:0,
                                sisa_pendapatan:0,
                                created_at:0,
                                pendapatan:0,
                                golongan:"",
                                email:"",
                                nip:"",
                                id:"",
                                id_pegawai:"",
                                idrekap:"",
                                jabatan:"",
                                nama:"",
                                rekening:"",
                                is_saveschema:0,
                                schemaJSON:'',
                                detailpegawai:null,
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
                this.setPegawai()                                
                this.getJenisGaji()
                this.getDetailPegawai()

            },      
            computed:{


             
            },
            methods:{
                focusName(){
                     if(!this.isEditForm){
                        this.$refs.namaPegawai.$el.focus()
                    }
                },
                clearPotongan(){
                        this.pegawai.kopri_dw = 0
                        this.pegawai.bpd = 0
                        this.pegawai.kop_melati = 0
                        this.pegawai.suka_duka = 0
                        this.pegawai.simp_voucher = 0
                        this.pegawai.cicilan_barang = 0
                        this.pegawai.pinjaman_koperasi = 0
                        this.pegawai.arisan_dw = 0
                        this.pegawai.werdhi_sedana = 0
                        this.pegawai.santunan_meninggal = 0
                        this.pegawai.pinjaman_kop_naker = 0
                        this.pegawai.simpanan_kop_naker = 0
                        this.pegawai.tabungan_mesra = 0
                        this.pegawai.bpr_kanti = 0
                        this.pegawai.kop_sinar = 0
                        //this.pegawai.is_saveschema = 1

                },
                set_jenis_gaji(){
                    this.label_jenis_gaji = this.pegawai.jenis_gaji_obj.nama
                },
                cekEditorAdd(){
                    if(typeof this.datapegawai !== 'undefined'){
                        this.isEditForm = true 
                    }else{
                        this.label_jenis_gaji = this.pegawai.jenis_gaji_obj.nama
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
                    axios.post(this.url+"/hideend/pegawai/showJenisGaji").then(function(response){
                        self.option_jenis_gaji = response.data.jenisGaji
                    })
                },
                getDetailPegawai() {
                    let self = this
                    axios.post(this.url+"/hideend/pegawai/showPegawai").then(function(response){
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
                                    showPegawaiDetail : false,                               
                                    showPegawaiTable : true                                    
                                }
                    this.$emit('back-data', valueHide)
                },
                setPegawai(){
                    this.pegawai.periode_gaji =moment().subtract(1, 'months').format('YYYY-MM-01')
                    if(this.isEditForm){                        
                        if (typeof this.datapegawai !== 'undefined'){
                            this.pegawai = this.datapegawai

                            
                        }
                    }
                   
                },

                finishPegawai() {

                     return this.$validator.validateAll("step1").then((result) => {

                        if (!result) {
                            alert('mohon melengkapi seluruh form diatas')
                            return false;
                        } else { 
                                if(typeof this.datapegawai!=='undefined'){
                                   this.updateData()
                                }else{
                                    this.addData()
                                }
                        }
                     })   

                },
                updateData(){
                    let self = this;
                    var formData = this.formData(this.pegawai);
                    axios.post(this.url + "/hideend/pegawai/update", formData).then(function(response) {
                        if (response.data.error) {
                            console.log(response.data.msg);
                        } else {
                            console.log('Update Success')                            
                            self.backtoTable()
                        }
                    })
                },
                addData(){
                    let self = this;
                    var formData = this.formData(this.pegawai);
                    axios.post(this.url + "/hideend/pegawai/insert", formData).then(function(response) {
                        if (response.data.error) {
                            console.log(response.data.msg);
                        } else {
                            console.log('Insert Success')     
                            if(self.isSaveNext){
                                //self.$refs.vuewizard.reset()
                                 window.location.href = myUrl + 'hideend/pegawai/';

                            }else{
                                window.location.href = myUrl + 'hideend/pegawai/lists';
                            }                       
                        }
                    })
                },
                clearPegawaiData() {
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
        'table-pegawai': tablePegawai,
        'detail-pegawai':detailPegawai,
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
        textSearch:"",
        choosePegawai:{},
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
        showPegawaiDetail: false,
        showPegawaiTable: true,
    },

    methods: {
        searchPegawai(){
            this.$refs.tablePegawai.showAll(this.textSearch)
        },    
        getIndexFormStep(data) {
            console.log("getIndexFormStep")
            console.log(data.step+1)            
            console.log("---getIndexFormStep")
            this.indexFormWizard = data.step+1
        },
        backtoTable(value){
            this.showPegawaiDetail = value.showPegawaiDetail
            this.showPegawaiTable = value.showPegawaiTable

        },
        finishProsesVerifikasi(value) {
            this.showPegawaiDetail = value.showPegawaiDetail
            this.showPegawaiTable = value.showPegawaiTable
        },
        getJenisForm(value) {
            this.jenisForm = value
        },
        getDatachoosePegawai(value) {
            this.choosePegawai = value
            this.showPegawaiDetail = true
            this.showPegawaiTable = false
           
        }







    }
})