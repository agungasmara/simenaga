<?php

class Penggajian_model extends CI_Model 
{
  public function struk_download($periode,$jenisGaji,$id_pegawai=""){
        $query = $this->db
                 ->select('p.*,rg.*');

        $query = $query->order_by('rg.id', 'DESC')
                      ->from('rekap_gaji rg')
                      ->where('rg.periode_gaji',$periode)
                      ->where('rg.jenis_gaji',$jenisGaji);
        if($id_pegawai!=""){
            $query = $query->where('rg.id_pegawai',$id_pegawai);
        }
                      
            $query = $query->join('pegawai p', 'rg.id_pegawai = p.id')
                      ->join('jenis_gaji jg', 'rg.jenis_gaji = jg.id')
                      ->group_by('rg.id')
                      ->get();

       // echo "<pre>"; print_r($this->db->last_query());die;
                      
                        
        if($query->num_rows() > 0){
            return $query->result();
        }else{
            return false;
        }
    }

    public function rekap_download($periode,$jenisGaji){
        $query = $this->db
                 ->select('p.*,rg.*');

        $query = $query->order_by('rg.id', 'DESC')
                      ->from('rekap_gaji rg')
                      ->where('rg.periode_gaji',$periode)
                      ->where('rg.jenis_gaji',$jenisGaji)
                      ->join('pegawai p', 'rg.id_pegawai = p.id')
                      ->join('jenis_gaji jg', 'rg.jenis_gaji = jg.id')
                      ->group_by('rg.id')
                      ->get();
                      
        if($query->num_rows() > 0){
            return $query->result();
        }else{
            return false;
        }
    }
  public function rekap($idjenisGaji=""){
        //$idjenisGaji = "1";  
        $query = $this->db
                 ->select('rg.periode_gaji per_gaji,jg.nama jen_gaji,sum(pendapatan) tot_gaji,rg.*');

        $query = $query->order_by('rg.id', 'DESC')
                      ->from('rekap_gaji rg');

        if($idjenisGaji!=""){
          $query = $query->where("rg.jenis_gaji",$idjenisGaji);
        }              

        $query = $query->join('pegawai p', 'rg.id_pegawai = p.id')
                      ->join('jenis_gaji jg', 'rg.jenis_gaji = jg.id')
                      ->group_by('rg.periode_gaji')
                      ->group_by('rg.jenis_gaji')
                      ->get();

        //echo "<pre>"; print_r($this->db->last_query());die;
                      
        if($query->num_rows() > 0){
            return $query->result();
        }else{
            return false;
        }
    }

  public function cekRekapExist($idpegawai,$periode,$jenis){
    
        $query = $this->db
              ->where('id_pegawai',$idpegawai)
              ->where('periode_gaji',$periode)
              ->where('jenis_gaji',$jenis)
              ->get('rekap_gaji');
  
        if($query->num_rows() > 0){
            return true;
        }else{
            return false;
        }
    }
	public function updatePegawai($id,$data) 
	{
		$this->db->where("id", $id)->update("pegawai", $data);
    //echo "<pre>"; print_r($this->db->last_query());
    return true ;
	}

  public function insertRekap($data) 
  {
    
    $this->db->insert("rekap_gaji", $data);
    return $this->db->insert_id();  
  }

  public function updateRekap($id,$data) 
  {
    $this->db->trans_start();
    $this->db->where("id", $id)->update("rekap_gaji", $data);
    $this->db->trans_complete();
    return $this->db->trans_status() ;
  }
  public function update_emailQueue($id, $data)
  {
    $this->db->where("id", $id)->update("email_queue", $data);
  }
  public function add_emailQueue($data)
  {
    $this->db->insert("email_queue", $data);
    return $this->db->insert_id();
  }
  public function get_emailQueue()
  {
    return $this->db
          ->where("status", 0)
          ->get("email_queue");
  }
	public function insert($data) 
	{
		$this->db->insert("pengajuan_pspbmn", $data);
		$insert_id = $this->db->insert_id();
		return  $insert_id;
	}

  public function showJenisGaji(){
		    $query = $this->db
              ->select('*')
              ->from('jenis_gaji')
              ->get();
                      
        if($query->num_rows() > 0){
            return $query->result();
        }else{
            return false;
        }
    }   

  public function showPegawai(){
        $query = $this->db
              ->select('*')
               ->where('active',1)
              ->from('pegawai')
              ->get();
                      
        if($query->num_rows() > 0){
            return $query->result();
        }else{
            return false;
        }
    } 


  public function showAll(){
        $query = $this->db
                 ->select('jg.nama jenis_gaji_nama,rg.*,rg.id idrekap,p.*,p.nama nama,total_potongan,sisa_pendapatan');

        $query = $query->order_by('rg.id', 'DESC')
                       ->where('p.active',1)
                      ->from('rekap_gaji rg')
                      ->join('pegawai p', 'rg.id_pegawai = p.id')
                      ->join('jenis_gaji jg', 'rg.jenis_gaji = jg.id')
                      ->group_by('rg.id')
                      ->get();
        //echo "<pre>"; print_r($this->db->last_query());die;
        if($query->num_rows() > 0){
            return $query->result();
        }else{
            return false;
        }
    }

    public function showEmail($idRekap=""){
        $query = $this->db
                 ->select('rg.id,p.email, p.nama, rg.periode_gaji, rg.id_pegawai, rg.jenis_gaji');

        $query = $query->order_by('rg.id', 'DESC')
                       ->where('p.active',1)
                       ->where('rg.sendemail',0);
        if($idRekap!=""){
          $query = $query->where('rg.id',$idRekap);  
        }else{
           $query = $query->where('p.active',1);
        }         
        $query = $query->from('rekap_gaji rg')
                      ->join('pegawai p', 'rg.id_pegawai = p.id')
                      ->group_by('rg.id')
                      ->get();
        if($query->num_rows() > 0){
            return $query->result();
        }else{
            return false;
        }
    }






	
}

?>