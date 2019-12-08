<?php

class Pengajuan_Model extends CI_Model 
{

	public function update($id,$data) 
	{
    $this->db->trans_start();
		$this->db->where("id", $id)->update("pengajuan_pspbmn", $data);
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



  public function showAll($userid=''){
        $status = array('DJKN Pusat', 'PKNSI');
        $query = $this->db
              ->select('p.*,
                        v.hasil_verifikasi,
                        v.suratHasilVerifikasifinal,
                        v.daftarKekuranganData,
                        v.rencana_survey,
                        v.nama_survey,
                        v.cp_survey')
              ->where_not_in('status_proses',$status);
        if($userid!==''){                 
              $query = $query->where('userid',$userid);
        } 

        $query = $query->order_by('id', 'DESC')
                      ->from('pengajuan_pspbmn p')
                      ->join('verifikasi_pspbmn v', 'p.id = v.idPengajuan', 'left')
                      ->get();
                      
        if($query->num_rows() > 0){
            return $query->result();
        }else{
            return false;
        }
    }



	
}

?>