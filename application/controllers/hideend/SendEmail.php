<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class SendEmail extends CI_Controller
{

	public function __construct()
	{
		parent::__construct();
		$this->load->model("content_model");
		$this->load->model("forex_model");
		$this->load->model("user_model");
		$this->load->model("penggajian_model");

	}

public function send() 
    {
        $dataEmail = $this->penggajian_model->get_emailQueue();
        foreach ($dataEmail->result() as $res) {
           //SEND ke CUSTOMER
            $replayto = "putu.ikha@gmail.com";
            //$emailCustomer = $res->email_send;
            $emailCustomer = $res->email_send;
            $body = $res->message;
            $subject = $res->subject;
            $from = "putu.ikha@gmail.com";
            $replayto = "putu.ikha@gmail.com";
            $appName = "SiMenAga";
            $bcc = "dode.agung.asmara@gmai.com";
            $attachment = $_SERVER["DOCUMENT_ROOT"]."/".$res->attach;

            echo "<pre>"; print_r($attachment);

            $this->common->send_email($subject, $body, $emailCustomer, $from,$replayto, $appName, "", $bcc, $attachment);

            $dataEmail = array(
                            "status" => 1
                        );
            $this->penggajian_model->update_emailQueue($res->id,$dataEmail);
        }
    }
	




	
	


}

?>
