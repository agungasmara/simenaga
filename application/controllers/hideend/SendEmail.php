<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class SendEmail extends CI_Controller
{

	public function __construct()
	{
		parent::__construct();
		$this->load->model("content_model");
		$this->load->model("forex_model");
		$this->load->model("user_model");
		$this->load->model("pengajuan_model");

	}

public function send() 
    {
        $dataEmail = $this->penggajian_model->get_emailQueue();
        foreach ($dataEmail->result() as $res) {
           //SEND ke CUSTOMER
            $replayto = "putu.ikha@gmail.com";
            $emailCustomer = $res->email_send;
            $body = $res->message;
            $subject = $res->subject;
            $from = "putu.ikha@gmail.com";
            $replayto = "putu.ikha@gmail.com";
            $appName = "SiMenAga";
            $bcc = "dode.agung.asmara@gmai.com";
            $attachment = $res->attach;

            $this->common->send_email($subject, $body, $emailCustomer, $from="",$replayto="", $appName="", $cc="", $bcc="", $attachment="");

            $dataEmail = array(
                            "status" => 1
                        );
            $this->penggajian_model->update_emailQueue($res->id,$dataEmail);
        }
    }
	




	
	


}

?>
