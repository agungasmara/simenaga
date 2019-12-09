<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Pegawai extends CI_Controller
{

	public function __construct()
	{
		parent::__construct();
        date_default_timezone_set('Asia/Jayapura');
		$this->load->model("content_model");
		$this->load->model("forex_model");
		$this->load->model("user_model");
		$this->load->model("Pegawai_model");
	//	$this->load->helper(array('form', 'url'));
		if (!$this->user->loggedin) 	redirect(site_url("hideend/login"));
//		echo "<pre>"; print_r($this->user);die;
		if(!$this->common->has_permissions(array(
				"admin", "content_manager", "content_worker","admin_members"), $this->user)) {
				$this->template->error(lang("error_81"));
		}
	}


	public function index(){
        $this->add();
    }


    public function add($idPengajuan='')
	{
		$this->template->loadData("activeLink",
			array("content" => array("general" => 1)));

		$vueComponentPegawaiForm = $this->load->view("hidepage/vue/ComponentPegawaiForm.js",'',true);
        $vueComponentPegawaiTable = $this->load->view("hidepage/vue/ComponentPegawaiTable.js",'',true);
		$this->template->loadExternal(
			'<link rel="stylesheet" href="https://unpkg.com/vue-form-wizard/dist/vue-form-wizard.min.css">'.
			'<link rel="stylesheet" href="https://unpkg.com/vue-multiselect@2.1.0/dist/vue-multiselect.min.css">'.
			'<link rel="stylesheet" href="https://unpkg.com/vue-airbnb-style-datepicker@2.7.1/dist/vue-airbnb-style-datepicker.min.css">'
			);
		$this->template->loadExternalJs(
			'<script src="https://unpkg.com/vue-form-wizard/dist/vue-form-wizard.js"></script>'.
			'<script src="https://cdn.jsdelivr.net/npm/vue-the-mask@0.11.1/dist/vue-the-mask.min.js"></script>'.
			'<script src="https://unpkg.com/vee-validate@2.0.0-rc.21/dist/vee-validate.js"></script>'.
			'<script src="https://unpkg.com/vue-multiselect@2.1.6/dist/vue-multiselect.min.js"></script>'.
			'<script src="https://unpkg.com/v-money@0.8.1/dist/v-money.js"></script>'.
			'<script src="'.$this->common->theme_hideend().'plugins/js/vue-airbnb-style-datepicker.min.js"></script>'.
			'<script src="'.$this->common->theme_hideend().'plugins/js/date_fns.js"></script>'.
            '<script src="https://unpkg.com/vuejs-datepicker"></script>'.
			$vueComponentPegawaiTable.
            $vueComponentPegawaiForm.
			'<script src="'.$this->common->theme_hideend().'plugins/js/appPegawai.js"></script>'
			);
		$this->template->loadContent("hidepage/pegawai/index.php", array(
				"idPengajuan" => $idPengajuan
			)
		);
	}



	public function lists()
	{  
		$this->template->loadData("activeLink",
			array("content" => array("general" => 1)));
		$vueComponentPegawaiForm = $this->load->view("hidepage/vue/ComponentPegawaiForm.js",'',true);
        $vueComponentPegawaiTable = $this->load->view("hidepage/vue/ComponentPegawaiTable.js",'',true);

		$this->template->loadExternal(
			'<link rel="stylesheet" href="https://unpkg.com/vue-form-wizard/dist/vue-form-wizard.min.css">'.
			'<link rel="stylesheet" href="https://unpkg.com/vue-multiselect@2.1.0/dist/vue-multiselect.min.css">'
			);

		$this->template->loadExternalJs(
			'<script src="https://unpkg.com/vue-form-wizard/dist/vue-form-wizard.js"></script>'.
			'<script src="https://cdn.jsdelivr.net/npm/vue-the-mask@0.11.1/dist/vue-the-mask.min.js"></script>'.
			'<script src="https://unpkg.com/vee-validate@2.0.0-rc.21/dist/vee-validate.js"></script>'.
			'<script src="https://unpkg.com/vue-multiselect@2.1.6/dist/vue-multiselect.min.js"></script>'.
			'<script src="https://unpkg.com/v-money@0.8.1/dist/v-money.js"></script>'.
            '<script src="'.$this->common->theme_hideend().'plugins/js/vuejs-datepicker.js"></script>'.
			'<script src="'.$this->common->theme_hideend().'plugins/js/date_fns.js"></script>'.
			$vueComponentPegawaiForm.
            $vueComponentPegawaiTable.
			'<script src="'.$this->common->theme_hideend().'plugins/js/appPegawai.js"></script>'
			);
		$this->template->loadContent("hidepage/pegawai/lists.php", array(
			)
		);
	}

	public function showUser(){
       	$userid=$this->user->info->ID;
       	$query =  $this->user_model->get_user_by_id($userid);
       	$data= $query->result();
       	$data= $data[0];
       	$result = [];
        if($query){
            $result['nama_petugas'] = $data->fullname;
            $result['nip_petugas'] = $data->nip;
            $result['jabatan_petugas'] = $data->jabatan;
            $result['kontak_petugas'] = $data->phone;
            $result['email_petugas'] = $data->email;
        }
  
        echo json_encode($result);
    }	

    public function show($id){
       	$query =  $this->Pegawai_model->showAllbyID($id);
       	$result = [];
        if($query){
            $result['pengajuan'] = $query;
        }
        echo json_encode($result);
    }

	public function showAllbyIDProses($jenisAkun=''){

		$userid=$this->user->info->ID;
       	$query =  $this->pengajuan_model->showAllbyProsesID($userid);
       	$result = [];
        if($query){
            $result['pengajuan'] = $query;
        }
        echo json_encode($result);	
	}


	public function showAll(){

       	$query =  $this->Pegawai_model->showAll();
        
       	$result = [];
        if($query){
            $result['pegawai'] = $query;
        }
        echo json_encode($result);
    }


    public function showJenisGaji(){
        
        
        $query =  $this->Pegawai_model->showJenisGaji();

        //echo "<pre>"; print_r($query);die;
        $result = [];
        if($query){
            $result['jenisGaji'] = $query;
        }
        echo json_encode($result);
    } 

    public function showPegawai(){
        
        
        $query =  $this->Pegawai_model->showPegawai();

        //echo "<pre>"; print_r($query);die;
        $result = [];
        if($query){
            $result['pegawai'] = $query;
        }
        echo json_encode($result,JSON_NUMERIC_CHECK);
    }





    public function updateStatusPengajuan()
    {
    	$id = $this->input->post('idPengajuan');


        $data = array(
                'status_pengajuan' => $this->input->post('status_pengajuan'));
        if($this->pengajuan_model->update($id, $data)){
        	 $result['error'] = false;
             $result['msg']   = 'Data updated successfully';
        }else{
        	$result['error'] = true;
        	$result['msg']   = 'Update Data ERROR';
        }

        echo json_encode($result);
    }

   	public function insert()
    {	
      
        $checked = $this->input->post('is_saveschema');

        $data = array(                
           'userid' => $this->user->info->ID,
           'updated_at' =>  date("Y-m-d H:i:s"),  
        );
            
        $dataRekap = array_merge($data,$this->getDataRekap()); 
        if($checked){
            $idpegawai = $this->input->post('id_pegawai');
            $dataPegawai = array_merge($data,$this->getDataPegawaiSchema()); 
            $this->Pegawai_model->updatePegawai($idpegawai, $dataPegawai);
        }
           
        if ($this->Pegawai_model->insertRekap($dataRekap)) {
                $result['error'] = false;
                $result['msg']   = 'Pengajuan Insert successfully';
               
        }else{
            
            $result['error'] = false;
            $result['msg']   = 'Pengajuan Insert Error';
        }
        // echo "<pre>"; print_r($this->db->last_query());die;          
        echo json_encode($result);
    }


    public function update()
    {   

        $id = $this->input->post('id');        
        $data = array(                
           'userid' => $this->user->info->ID,
           'updated_at' =>  date("Y-m-d H:i:s"),  
        );
            
        $dataPegawai = array_merge($data,$this->getDataRekap()); 
           
        if ( $this->Pegawai_model->updatePegawai($id, $dataPegawai)) {
                $result['error'] = false;
                $result['msg']   = 'Pengajuan Updated successfully';
               
        }else{
                
            $result['error'] = false;
            $result['msg']   = 'Pengajuan Updated Error';
        }
            
        echo json_encode($result);
    }

    public function getDataRekap(){
        $dataRekap = array(
                'nama' => $this->input->post('nama'),
                'nip' => $this->input->post('nip'),
                'jabatan' => $this->input->post('jabatan'),
                'golongan' => $this->input->post('golongan'),
                'rekening' => $this->input->post('rekening'),
                'gaji_pokok' => $this->input->post('gaji_pokok'),
                'gaji_pokok' => $this->input->post('gaji_pokok'),
                'tunjangan_jabatan' => $this->input->post('tunjangan_jabatan'),
            );

        return $dataRekap;
    }

    public function getDataPegawaiSchema(){
        $dataRekap['is_saveschema'] = ((int)$this->input->post('is_saveschema')?1:0);
        if((int)$this->input->post('is_saveschema')){
            $dataRekap['schemaJSON'] = $this->input->post('schemaJSON');
        }

        return $dataRekap;
    }


    public function finishPegawai(){
		


		$result['error'] = false;
        $result['msg']   = 'Proses Pegawai Berhasil!';

		echo json_encode($result);

	}

	public function sendEmailQueueTable($dataEmail)
    {   
       
        return $this->pengajuan_model->add_emailQueue($dataEmail);
        
    } 

    public function sendEmail() 
    {
        $dataEmail = $this->pengajuan_model->get_emailQueue();
        foreach ($dataEmail->result() as $res) {
           //SEND ke CUSTOMER
            $replayto             = "aplikasiapuse@gmail.com";
            $emailCustomer = $res->email_send;
            $body = $res->message;
            $subject = $res->subject;
           	$this->common->send_email($subject, $body, $emailCustomer, $replayto);

            $dataEmail = array(
                            "status" => 1
                        );
            $this->pengajuan_model->update_emailQueue($res->id,$dataEmail);
        }
    }
	public function uploadFile()
	{	
		$dataArray = array();
		$this->load->library("upload");
		if (isset($_FILES['file1']) || isset($_FILES['file2']) || isset($_FILES['file3'])) {
			$this->upload->initialize(array(
		       "upload_path" => $this->settings->info->upload_path."/pengajuan/",
		       "overwrite" => FALSE,
		       "max_filename" => 300,
		       "encrypt_name" => false,
		       "remove_spaces" => TRUE,
		       "allowed_types" => "docx|doc|xlsx|xls|pdf|jpg|jpeg|png",
		       "max_size" => 5000
		    ));

		    $tipe = array();
		    $file = array();
		    $msg = array();
		    $error = array();
		    if(isset($_FILES['file1'])){
				if($this->upload->do_upload('file1')){
					$data = $this->upload->data();
					$FileData = $data['file_name'];
					$error[] = false;
			    	$file[] = "/pengajuan/".$FileData;			    	    	
			    	$tipe[] = "file1";
			    	$msg[] = "Successfully upload!";
				}else{
					$error[] = true;
			    	$msg[] = $this->upload->display_errors();
				}	

			}
					

		    if(isset($_FILES['file2'])){
				if($this->upload->do_upload('file2')){
					$data = $this->upload->data();
					$FileData = $data['file_name'];
					$error[] = false;
			    	$file[] = "/pengajuan/".$FileData;		    	
			    	$tipe[] = "file2";
			    	$msg[] = "Successfully upload!";
				}else{
					$error[] = true;
			    	$msg[] = $this->upload->display_errors();
				}		
			}		


		    if(isset($_FILES['file3'])){
				if($this->upload->do_upload('file3')){
					$data = $this->upload->data();
					$FileData = $data['file_name'];
					$error[] = false;
			    	$file[] = "/pengajuan/".$FileData;
			    	$tipe[] = "file3";
			    	$msg[] = "Successfully upload!";
				}else{
					$error[] = true;
			    	$msg[] = $this->upload->display_errors();
				}	
			}	

		     $dataArray = array(
							"error" => $error,
							"msg" => $msg,
							"tipe" => $tipe,
							"file" => $file
				);
		    

		}

		echo json_encode($dataArray);

	}





	
	


}

?>
