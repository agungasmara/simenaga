<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

include APPPATH.'third_party/PhpExcel/Classes/PHPExcel.php';
include_once(APPPATH."third_party/PhpWord/Autoloader.php");


use PhpOffice\PhpWord\Autoloader;
use PhpOffice\PhpWord\Settings;
use PhpOffice\PhpWord\PhpWord;
// use PhpOffice\PhpWord\Settings::setPdfRendererPath('application/third_party/tcpdf');
// use PhpOffice\PhpWord\Settings::setPdfRendererName(Settings::PDF_RENDERER_TCPDF);

Autoloader::register();
Settings::loadConfig();

class Penggajian extends CI_Controller
{

	public function __construct()
	{
		parent::__construct();
        date_default_timezone_set('Asia/Jayapura');
		$this->load->model("content_model");
		$this->load->model("forex_model");
		$this->load->model("user_model");
		$this->load->model("penggajian_model");
		if (!$this->user->loggedin) 	redirect(site_url("hideend/login"));
		if(!$this->common->has_permissions(array(
				"admin", "content_manager", "content_worker","admin_members"), $this->user)) {
				$this->template->error(lang("error_81"));
		}
	}
    public function index(){
        $this->add();
    }
    public function struk_download($periode="",$jenis_gaji="",$id_pegawai=""){

        $file = $this->generateSlipGaji($periode,$jenis_gaji,$id_pegawai);
        
        $folder = "./testExcel/"; 
        $this->toPdf($folder. $file,$folder);
        $result['struk'] = array(
                               "status" => 1,
                               "namafile" => $file,    
                               "filepath" =>  $folder.$file    
                            );
        echo json_encode($result);
    }

        //Generate document fix
    public function toPdf($file,$folder){
        \PhpOffice\PhpWord\Settings::setPdfRendererPath('vendor/dompdf/dompdf');
        \PhpOffice\PhpWord\Settings::setPdfRendererName('DomPDF');

        // \PhpOffice\PhpWord\Settings::setPdfRendererPath('vendor/tecnickcom/tcpdf');
        // \PhpOffice\PhpWord\Settings::setPdfRendererName(Settings::PDF_RENDERER_TCPDF);

        // \PhpOffice\PhpWord\Settings::setPdfRendererPath('vendor/mpdf/mpdf');
        // \PhpOffice\PhpWord\Settings::setPdfRendererName(Settings::PDF_RENDERER_MPDF);

        $phpWord = new \PhpOffice\PhpWord\PhpWord();


        //Load temp file
        $phpWord = \PhpOffice\PhpWord\IOFactory::load($file); 
        //Save it
        $xmlWriter = \PhpOffice\PhpWord\IOFactory::createWriter($phpWord , 'PDF');
        $xmlWriter->save($folder.'result.pdf',TRUE);  

    }
    public function generateSlipGaji($periode="",$jenis_gaji="",$id_pegawai=""){
        $file = 'template_slip_gaji.docx';
        $targetFile = "./testExcel/";        
        $targetSaveFile = "./testExcel/";

        $TemplateProcessor = new \PhpOffice\PhpWord\TemplateProcessor($targetFile.$file);
        $dataArray =  $this->penggajian_model->struk_download($periode,$jenis_gaji,$id_pegawai);
        
        $TemplateProcessor->cloneBlock('CLONEME', sizeof($dataArray));
        //echo "<pre>"; print_r($dataArray);die;

        foreach ($dataArray as $key => $data) {
            $bpd = $data->bpd_gianyar + $data->bpd_ubud + $data->bpd_tampaksiring + $data->bpd_sukawati; 

            $date_periode= strtoupper($this->common->bln_indo($data->periode_gaji));

            $total_potongan = $data->kopri_dw + $bpd + $data->kop_melati + $data->suka_duka + $data->simp_voucher + $data->cicilan_barang + $data->pinjaman_koperasi + $data->arisan_dw + $data->werdhi_sedana + $data->santunan_meninggal + $data->simpanan_kop_naker + $data->pinjaman_kop_naker + $data->tabungan_mesra + $data->bpr_kanti + $data->kop_sinar  + $data->kop_sinar;

            $sisa_pendapatan = $data->gaji_pokok - $total_potongan;

            $num = 1;
            $TemplateProcessor->setValue('kopri_dw', $this->formatGaji($data->kopri_dw),$num);
            $TemplateProcessor->setValue('bpd', $this->formatGaji($bpd),$num);
            $TemplateProcessor->setValue('kop_melati', $this->formatGaji($data->kop_melati),$num);
            $TemplateProcessor->setValue('suka_duka', $this->formatGaji($data->suka_duka),$num);
            $TemplateProcessor->setValue('simp_voucher', $this->formatGaji($data->simp_voucher),$num);
            $TemplateProcessor->setValue('cicilan_barang', $this->formatGaji($data->cicilan_barang),$num);
            $TemplateProcessor->setValue('pinjaman_koperasi', $this->formatGaji($data->pinjaman_koperasi),$num);
            $TemplateProcessor->setValue('arisan_dw', $this->formatGaji($data->arisan_dw),$num);
            $TemplateProcessor->setValue('werdhi_sedana', $this->formatGaji($data->werdhi_sedana),$num);
            $TemplateProcessor->setValue('santunan_meninggal', $this->formatGaji($data->santunan_meninggal),$num);
            $TemplateProcessor->setValue('simpanan_kop_naker', $this->formatGaji($data->simpanan_kop_naker),$num);
            $TemplateProcessor->setValue('pinjaman_kop_naker', $this->formatGaji($data->pinjaman_kop_naker),$num);
            $TemplateProcessor->setValue('tabungan_mesra', $this->formatGaji($data->tabungan_mesra),$num);
            $TemplateProcessor->setValue('bpr_kanti', $this->formatGaji($data->bpr_kanti),$num);
            $TemplateProcessor->setValue('kop_sinar', $this->formatGaji($data->kop_sinar),$num);
            $TemplateProcessor->setValue('nama', $data->nama,$num);
            $TemplateProcessor->setValue('gaji_pokok', $this->formatGaji($data->gaji_pokok),$num);
            $TemplateProcessor->setValue('kop_sinar', $this->formatGaji($data->kop_sinar),$num);
            $TemplateProcessor->setValue('total_potongan', $this->formatGaji($total_potongan),$num);
            $TemplateProcessor->setValue('sisa_pendapatan', $this->formatGaji($sisa_pendapatan),$num);
            $TemplateProcessor->setValue('periode_gaji', $date_periode,$num);

            
        }
        

        if($id_pegawai!=""){
            $fileSave = 'Struk_gaji_'.$this->common->clean($data->nama).'_periode_'.$date_periode.'.docx';
        }else{
          $fileSave ='Struk_All_Pegawai_periode_'.$date_periode.'.docx';
        }
        $TemplateProcessor->saveAs($targetSaveFile.$fileSave);
        return $fileSave;
    }

    public function formatGaji($gaji){
        return ($gaji==0)?"-":$this->common->formatIDR($gaji,"");
    }

    public function rekap_download($periode="",$jenis_gaji=""){

        $data =  $this->penggajian_model->rekap_download($periode,$jenis_gaji);
        $folder = "./testExcel/"; 
        
        
            $file = $this->excel_potongan_gaji($data,$folder);    
       

        $result['rekap'] = array(
                               "status" => 1,
                               "namafile" => $file,    
                               "filepath" =>  $folder.$file    
                            );
        echo json_encode($result);
    }

    public function excel_tunjangan_kesra($data,$folder)
    {

        //echo "<pre>"; print_r($data);die;
        $objReader = PHPExcel_IOFactory::createReader('Excel5');
        $objPHPExcel = $objReader->load("./testExcel/template_kesra.xls");

        //Sheet 1
        $objWorksheet = $objPHPExcel->setActiveSheetIndex(0);
        $objWorksheet->setCellValue('D1', PHPExcel_Shared_Date::PHPToExcel(time()));
        $baseRow =7;
        $row = 0;
        $date = "";
        foreach($data as $r => $dt) {
            $row = $baseRow + $r;
            $objWorksheet->insertNewRowBefore($row,1);
            $objWorksheet->setCellValue('A'.$row, $r+1)
                         ->setCellValue('B'.$row, $dt->nama)
                         ->setCellValue('C'.$row, $dt->tunjangan_jabatan)
                         ->setCellValue('D'.$row,  $dt->cicilan_barang)
                         ->setCellValue('E'.$row,  $dt->pinjaman_koperasi)
                         ->setCellValue('F'.$row,  $dt->werdhi_sedana)
                         ->setCellValue('G'.$row,  $dt->simpanan_kop_naker)
                         ->setCellValue('H'.$row, '=SUM(D'.$row.':G'.$row.')')
                         ->setCellValue('I'.$row, '=(C'.$row.'-H'.$row.')');

            $date_periode = $dt->periode_gaji;             
        }
        $row = $row + 1;
        $objWorksheet->insertNewRowBefore($row,1);


        $objWorksheet->mergeCells('A'.$row.':B'.$row);
        $style = array(
                'alignment' => array(
                    'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER,
                ));

        $objWorksheet->getStyle('A'.$row)->applyFromArray($style);
        $objWorksheet->setCellValue('A'.$row,"Total");

        $styleArray = array(
                     'fill' => array(
                        'type' => PHPExcel_Style_Fill::FILL_SOLID,
                        'color' => array('rgb' => '67D36D')
                    ));
        $objWorksheet->getStyle("C".$row.":I".$row)->applyFromArray($styleArray);
        $objWorksheet->setCellValue('C'.$row, '=SUM(C'.$baseRow.':C'.($row-1).')'  )
                      ->setCellValue('D'.$row, '=SUM(D'.$baseRow.':D'.($row-1).')' )
                      ->setCellValue('E'.$row, '=SUM(E'.$baseRow.':E'.($row-1).')' )
                      ->setCellValue('F'.$row, '=SUM(F'.$baseRow.':F'.($row-1).')' )
                      ->setCellValue('G'.$row, '=SUM(G'.$baseRow.':G'.($row-1).')' )
                      ->setCellValue('H'.$row, '=SUM(H'.$baseRow.':H'.($row-1).')' )
                      ->setCellValue('I'.$row, '=SUM(I'.$baseRow.':I'.($row-1).')' );
        $objWorksheet->removeRow($baseRow-1,1);

        //end Sheet 1
          
        $date_periode=date_create($date_periode);
        $date_periode= date_format($date_periode,"M Y");
        $namefile = "/Rekap_Tunjangan_".$date_periode.".xls";     
        $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
        $objWriter->save($folder.$namefile);
        return $namefile;

    }

    public function excel_potongan_gaji($data,$folder)
    {
        $objReader = PHPExcel_IOFactory::createReader('Excel5');
        $objPHPExcel = $objReader->load("./testExcel/template_potongan.xls");

        //Sheet 1
        $objWorksheet = $objPHPExcel->setActiveSheetIndex(0);
        $objWorksheet->setCellValue('D1', PHPExcel_Shared_Date::PHPToExcel(time()));
        $baseRow =8;
        $row = 0;
        foreach($data as $r => $dt) {
            $row = $baseRow + $r;
            $objWorksheet->insertNewRowBefore($row,1);
            $objWorksheet->setCellValue('A'.$row, $r+1)
                         ->setCellValue('B'.$row, $dt->nama)
                         ->setCellValue('C'.$row, $dt->gaji_pokok)
                         ->setCellValue('D'.$row,  $dt->kopri_dw)
                         ->setCellValue('E'.$row,  ($dt->bpd_gianyar+$dt->bpd_ubud+$dt->bpd_tampaksiring+$dt->bpd_sukawati))
                         ->setCellValue('F'.$row,  $dt->kop_melati)
                         ->setCellValue('G'.$row,  $dt->suka_duka)
                         ->setCellValue('H'.$row,  $dt->simp_voucher)
                         ->setCellValue('I'.$row,  $dt->cicilan_barang)
                         ->setCellValue('J'.$row,  $dt->pinjaman_koperasi)
                         ->setCellValue('K'.$row,  $dt->arisan_dw)
                         ->setCellValue('L'.$row,  $dt->werdhi_sedana)
                         ->setCellValue('M'.$row,  $dt->santunan_meninggal)
                         ->setCellValue('N'.$row,  $dt->pinjaman_kop_naker)
                         ->setCellValue('O'.$row,  $dt->simpanan_kop_naker)
                         ->setCellValue('P'.$row,  $dt->tabungan_mesra)
                         ->setCellValue('Q'.$row,  $dt->bpr_kanti)
                         ->setCellValue('R'.$row,  $dt->kop_sinar)
                         ->setCellValue('S'.$row, '=SUM(D'.$row.':R'.$row.')')
                         ->setCellValue('T'.$row, '=(C'.$row.'-S'.$row.')')
                         ->setCellValue('U'.$row, $r+1);

             $date_periode = $dt->periode_gaji;
        }
        $row = $row + 1;
        $objWorksheet->insertNewRowBefore($row,1);

        $styleArray = array(
                     'fill' => array(
                        'type' => PHPExcel_Style_Fill::FILL_SOLID,
                        'color' => array('rgb' => 'FF0000')
                    )
        );

        $objWorksheet->getStyle('C'.$row)->applyFromArray($styleArray);
        $objWorksheet->setCellValue('C'.$row, '=SUM(C'.$baseRow.':C'.($row-1).')'  )
                      ->setCellValue('M'.$row, '=SUM(M'.$baseRow.':M'.($row-1).')' )
                      ->setCellValue('R'.$row, '=SUM(R'.$baseRow.':R'.($row-1).')' )
                      ->setCellValue('S'.$row, '=SUM(S'.$baseRow.':S'.($row-1).')' )
                      ->setCellValue('T'.$row, '=SUM(T'.$baseRow.':T'.($row-1).')' );
        $objWorksheet->removeRow($baseRow-1,1);

        //end Sheet 1

        //Sheet 2
        $objWorksheet = $objPHPExcel->setActiveSheetIndex(1);
        $objWorksheet->setCellValue('D1', PHPExcel_Shared_Date::PHPToExcel(time()));
        $baseRow =6;
        $row = 0;
        foreach($data as $r => $dt) {
            $row = $baseRow + $r;
            $objWorksheet->insertNewRowBefore($row,1);
            $objWorksheet->setCellValue('A'.$row, $r+1)
                         ->setCellValue('B'.$row, $dt->nama)
                         ->setCellValue('C'.$row,  $dt->rekening)                         
                         ->setCellValue('D'.$row, $dt->gaji_pokok)
                         ->setCellValue('E'.$row,  $dt->bpd_gianyar)
                         ->setCellValue('F'.$row,  $dt->bpd_ubud)
                         ->setCellValue('G'.$row,  $dt->bpd_tampaksiring)
                         ->setCellValue('H'.$row,  $dt->bpd_sukawati)
                         ->setCellValue('I'.$row,  $dt->potongan_lain)
                         ->setCellValue('J'.$row, '=D'.$row.' -SUM(E'.$row.':I'.$row.')');
        }
        $row = $row + 1;
        $objWorksheet->insertNewRowBefore($row,1);

        $styleArray = array(
                     'fill' => array(
                        'type' => PHPExcel_Style_Fill::FILL_SOLID,
                        'color' => array('rgb' => 'FF0000')
                    )
        );

        $objWorksheet->mergeCells('A'.$row.':C'.$row);
        $objWorksheet->getStyle('C'.$row)->applyFromArray($styleArray);
        $objWorksheet->setCellValue('A'.$row, 'Total'  )
                     ->setCellValue('D'.$row, '=SUM(D'.$baseRow.':D'.($row-1).')' )
                     ->setCellValue('E'.$row, '=SUM(E'.$baseRow.':E'.($row-1).')' )
                      ->setCellValue('F'.$row, '=SUM(F'.$baseRow.':F'.($row-1).')' )
                      ->setCellValue('G'.$row, '=SUM(G'.$baseRow.':G'.($row-1).')' )
                      ->setCellValue('H'.$row, '=SUM(H'.$baseRow.':H'.($row-1).')' )
                      ->setCellValue('I'.$row, '=SUM(I'.$baseRow.':I'.($row-1).')' )
                      ->setCellValue('J'.$row, '=SUM(J'.$baseRow.':J'.($row-1).')' );

         $objWorksheet->removeRow($baseRow-1,1);

        //end Sheet 1
  
        $date_periode=date_create($date_periode);
        $date_periode= date_format($date_periode,"M Y");
        $namefile = "/Rekap_Gaji_".$date_periode.".xls";     
        $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
        $objWriter->save($folder.$namefile);
        return $namefile;

    }

    public function potongan()
	{
		$this->template->loadData("activeLink",
			array("content" => array("general" => 1)));

		$vueComponentPenggajianForm = $this->load->view("hidepage/vue/ComponentPenggajianForm.js",'',true);
        $vueComponentPenggajianTable = $this->load->view("hidepage/vue/ComponentPenggajianTable.js",'',true);

        $vueComponentPotonganTable = $this->load->view("hidepage/vue/ComponentRekapPotonganTable.js",'',true);

		$this->template->loadExternal(
			'<link rel="stylesheet" href="https://unpkg.com/vue-form-wizard/dist/vue-form-wizard.min.css">'.
			'<link rel="stylesheet" href="https://unpkg.com/vue-multiselect@2.1.1/dist/vue-multiselect.min.css">'.            
            '<link rel="stylesheet" href="'.$this->common->theme_hideend().'plugins/js/vuejs-dialog-master/dist/vuejs-dialog.min.css">'.
			'<link rel="stylesheet" href="https://unpkg.com/vue-airbnb-style-datepicker@2.7.1/dist/vue-airbnb-style-datepicker.min.css">'
			);
		$this->template->loadExternalJs(
			'<script src="https://unpkg.com/vue-form-wizard/dist/vue-form-wizard.js"></script>'.
			'<script src="https://cdn.jsdelivr.net/npm/vue-the-mask@0.11.1/dist/vue-the-mask.min.js"></script>'.
			'<script src="https://unpkg.com/vee-validate@2.0.0-rc.21/dist/vee-validate.js"></script>'.
			'<script src="https://unpkg.com/vue-multiselect@2.1.1/dist/vue-multiselect.min.js"></script>'.
			'<script src="https://unpkg.com/v-money@0.8.1/dist/v-money.js"></script>'.
			'<script src="'.$this->common->theme_hideend().'plugins/js/vue-airbnb-style-datepicker.min.js"></script>'.
			'<script src="'.$this->common->theme_hideend().'plugins/js/date_fns.js"></script>'.
            '<script src="https://unpkg.com/vuejs-datepicker"></script>'.

            '<script src="'.$this->common->theme_hideend().'plugins/js/vuejs-dialog-master/dist/vuejs-dialog.min.js"></script>'.
            '<script src="'.$this->common->theme_hideend().'plugins/js/vuejs-dialog-master/dist/vuejs-dialog-mixin.min.js"></script>'.
			$vueComponentPenggajianTable.
            $vueComponentPenggajianForm.
            $vueComponentPotonganTable.
			'<script src="'.$this->common->theme_hideend().'plugins/js/appPenggajian.js"></script>'
			);
		$this->template->loadContent("hidepage/penggajian/potongan.php");
	}

    public function add($idPengajuan='')
    {
        $this->template->loadData("activeLink",
            array("content" => array("general" => 1)));

        $vueComponentPenggajianForm = $this->load->view("hidepage/vue/ComponentPenggajianForm.js",'',true);
        $vueComponentPenggajianTable = $this->load->view("hidepage/vue/ComponentPenggajianTable.js",'',true);
        $this->template->loadExternal(
            '<link rel="stylesheet" href="https://unpkg.com/vue-form-wizard/dist/vue-form-wizard.min.css">'.
            '<link rel="stylesheet" href="https://unpkg.com/vue-multiselect@2.1.1/dist/vue-multiselect.min.css">'.            
            '<link rel="stylesheet" href="'.$this->common->theme_hideend().'plugins/js/vuejs-dialog-master/dist/vuejs-dialog.min.css">'.
            '<link rel="stylesheet" href="https://unpkg.com/vue-airbnb-style-datepicker@2.7.1/dist/vue-airbnb-style-datepicker.min.css">'
            );
        $this->template->loadExternalJs(
            '<script src="https://unpkg.com/vue-form-wizard/dist/vue-form-wizard.js"></script>'.
            '<script src="https://cdn.jsdelivr.net/npm/vue-the-mask@0.11.1/dist/vue-the-mask.min.js"></script>'.
            '<script src="https://unpkg.com/vee-validate@2.0.0-rc.21/dist/vee-validate.js"></script>'.
            '<script src="https://unpkg.com/vue-multiselect@2.1.1/dist/vue-multiselect.min.js"></script>'.
            '<script src="https://unpkg.com/v-money@0.8.1/dist/v-money.js"></script>'.
            '<script src="'.$this->common->theme_hideend().'plugins/js/vue-airbnb-style-datepicker.min.js"></script>'.
            '<script src="'.$this->common->theme_hideend().'plugins/js/date_fns.js"></script>'.
            '<script src="https://unpkg.com/vuejs-datepicker"></script>'.

            '<script src="'.$this->common->theme_hideend().'plugins/js/vuejs-dialog-master/dist/vuejs-dialog.min.js"></script>'.
            '<script src="'.$this->common->theme_hideend().'plugins/js/vuejs-dialog-master/dist/vuejs-dialog-mixin.min.js"></script>'.
            $vueComponentPenggajianTable.
            $vueComponentPenggajianForm.
            '<script src="'.$this->common->theme_hideend().'plugins/js/appPenggajian.js"></script>'
            );
        $this->template->loadContent("hidepage/penggajian/index.php", array(
                "idPengajuan" => $idPengajuan
            )
        );
    }



	public function download($idJenisGaji="")
	{  
		$this->template->loadData("activeLink",
			array("content" => array("general" => 1)));
		$vueComponentPenggajianForm = $this->load->view("hidepage/vue/ComponentPenggajianForm.js",'',true);
        $vueComponentPenggajianTable = $this->load->view("hidepage/vue/ComponentPenggajianTable.js",'',true);
        $vueComponentRekapPenggajianTable = $this->load->view("hidepage/vue/ComponentRekapPenggajianTable.js",'',true);

		$this->template->loadExternal(
			'<link rel="stylesheet" href="https://unpkg.com/vue-form-wizard/dist/vue-form-wizard.min.css">'.
            '<link rel="stylesheet" href="'.$this->common->theme_hideend().'plugins/js/vuejs-dialog-master/dist/vuejs-dialog.min.css">'.
			'<link rel="stylesheet" href="https://unpkg.com/vue-multiselect@2.1.1/dist/vue-multiselect.min.css">'
			);

		$this->template->loadExternalJs(
			'<script src="https://unpkg.com/vue-form-wizard/dist/vue-form-wizard.js"></script>'.
            '<script src="'.$this->common->theme_hideend().'plugins/js/vuejs-dialog-master/dist/vuejs-dialog.min.js"></script>'.
            '<script src="'.$this->common->theme_hideend().'plugins/js/vuejs-dialog-master/dist/vuejs-dialog-mixin.min.js"></script>'.
			'<script src="https://cdn.jsdelivr.net/npm/vue-the-mask@0.11.1/dist/vue-the-mask.min.js"></script>'.
			'<script src="https://unpkg.com/vee-validate@2.0.0-rc.21/dist/vee-validate.js"></script>'.
			'<script src="https://unpkg.com/vue-multiselect@2.1.1/dist/vue-multiselect.min.js"></script>'.
			'<script src="https://unpkg.com/v-money@0.8.1/dist/v-money.js"></script>'.
            '<script src="'.$this->common->theme_hideend().'plugins/js/vuejs-datepicker.js"></script>'.
			'<script src="'.$this->common->theme_hideend().'plugins/js/date_fns.js"></script>'.
            $vueComponentRekapPenggajianTable.
			'<script src="'.$this->common->theme_hideend().'plugins/js/appPenggajian.js"></script>'
			);
		$this->template->loadContent("hidepage/penggajian/download.php");
	} 

    public function lists()
    {  
        $this->template->loadData("activeLink",
            array("content" => array("general" => 1)));
        $vueComponentPenggajianForm = $this->load->view("hidepage/vue/ComponentPenggajianForm.js",'',true);
        $vueComponentPenggajianTable = $this->load->view("hidepage/vue/ComponentPenggajianTable.js",'',true);

        $this->template->loadExternal(
            '<link rel="stylesheet" href="https://unpkg.com/vue-form-wizard/dist/vue-form-wizard.min.css">'.
            '<link rel="stylesheet" href="'.$this->common->theme_hideend().'plugins/js/vuejs-dialog-master/dist/vuejs-dialog.min.css">'.
            '<link rel="stylesheet" href="https://unpkg.com/vue-multiselect@2.1.1/dist/vue-multiselect.min.css">'
            );

        $this->template->loadExternalJs(
            '<script src="https://unpkg.com/vue-form-wizard/dist/vue-form-wizard.js"></script>'.
            '<script src="'.$this->common->theme_hideend().'plugins/js/vuejs-dialog-master/dist/vuejs-dialog.min.js"></script>'.
            '<script src="'.$this->common->theme_hideend().'plugins/js/vuejs-dialog-master/dist/vuejs-dialog-mixin.min.js"></script>'.
            '<script src="https://cdn.jsdelivr.net/npm/vue-the-mask@0.11.1/dist/vue-the-mask.min.js"></script>'.
            '<script src="https://unpkg.com/vee-validate@2.0.0-rc.21/dist/vee-validate.js"></script>'.
            '<script src="https://unpkg.com/vue-multiselect@2.1.1/dist/vue-multiselect.min.js"></script>'.
            '<script src="https://unpkg.com/v-money@0.8.1/dist/v-money.js"></script>'.
            '<script src="'.$this->common->theme_hideend().'plugins/js/vuejs-datepicker.js"></script>'.
            '<script src="'.$this->common->theme_hideend().'plugins/js/date_fns.js"></script>'.
            $vueComponentPenggajianForm.
            $vueComponentPenggajianTable.
            '<script src="'.$this->common->theme_hideend().'plugins/js/appPenggajian.js"></script>'
            );
        $this->template->loadContent("hidepage/penggajian/lists.php", array(
            )
        );
    }


    public function show($id){
       	$query =  $this->penggajian_model->showAllbyID($id);
       	$result = [];
        if($query){
            $result['pengajuan'] = $query;
        }
        echo json_encode($result);
    }



	public function rekap($idjenisgaji=''){
       	$query =  $this->penggajian_model->rekap($idjenisgaji);
       	$result = [];
        if($query){
            $result['rekap'] = $query;
        }
        echo json_encode($result);
    }

    public function showAll($txtSearch=''){
        
        $query =  $this->penggajian_model->showAll($txtSearch);
        $result = [];
        if($query){
            $result['penggajian'] = $query;
        }
        echo json_encode($result);
    }


    public function showJenisGaji(){
        
        
        $query =  $this->penggajian_model->showJenisGaji();

        //echo "<pre>"; print_r($query);die;
        $result = [];
        if($query){
            $result['jenisGaji'] = $query;
        }
        echo json_encode($result);
    } 

    public function showPegawai(){
        
        
        $query =  $this->penggajian_model->showPegawai();

        //echo "<pre>"; print_r($query);die;
        $result = [];
        if($query){
            $result['pegawai'] = $query;
        }
        echo json_encode($result,JSON_NUMERIC_CHECK);
    }

  
   	public function insert()
    {	
      
        $checked = $this->input->post('is_saveschema');

        $data = array(                
           'userid' => $this->user->info->ID,
           'updated_at' =>  date("Y-m-d H:i:s"),  
        );
        $dataRekap = array_merge($data,$this->getDataRekap()); 
        $isRekapExist = $this->isRekapExist($dataRekap["id_pegawai"],$dataRekap["periode_gaji"],$dataRekap["jenis_gaji"]);
        if(!$isRekapExist){    
            
            if($checked){
                $idpegawai = $this->input->post('id_pegawai');
                $dataPegawai = array_merge($data,$this->getDataPegawaiSchema()); 
                $this->penggajian_model->updatePegawai($idpegawai, $dataPegawai);
            }

        
            if ($this->penggajian_model->insertRekap($dataRekap)) {
                    $result['error'] = false;
                    $result['msg']   = 'Pengajuan Insert successfully';
                   
            }else{
                
                $result['error'] = true;
                $result['msg']   = 'Internal db error';
            }

        }else{
            $result['error'] = true;
            $result['msg']   = 'Rekap Duplicate!';
        }
           

        // echo "<pre>"; print_r($this->db->last_query());die;          
        echo json_encode($result);
        
    }
    public function isRekapExist($idpegawai,$periode,$jenis){
        $result = $this->penggajian_model->cekRekapExist($idpegawai,$periode,$jenis);
        return $result;
    }

    public function update_potongan()
    {   

        $dataArray = json_decode($this->input->post('data'));
       // echo CI_VERSION;
        //echo "<pre>"; print_r($this->db);die;
        //$this->db->insert_batch('rekap_gaji', $dataArray);
        //biar bisa pakkai fungsi ini, tambahkan di application core: MY_DB_mysql_driver.php & MY_Loader.php
        $this->db->insert_on_duplicate_update_batch('rekap_gaji',$dataArray);

        
        $id = $this->input->post('idrekap');        

        $data = array(                
           'userid' => $this->user->info->ID,
           'updated_at' =>  date("Y-m-d H:i:s"),  
        );
            
        $dataRekap = array_merge($data,$this->getDataRekap()); 
        
        $idpegawai = $this->input->post('id_pegawai');
        $dataPegawai = array_merge($data,$this->getDataPegawaiSchema()); 
        $this->penggajian_model->updatePegawai($idpegawai, $dataPegawai);
        
   
        if ($this->penggajian_model->updateRekap($id, $dataRekap)) {
                $result['error'] = false;
                $result['msg']   = 'Pengajuan Updated successfully';
               
        }else{
                
            $result['error'] = false;
            $result['msg']   = 'Pengajuan Updated Error';
        }
            
        echo json_encode($result);
    } 

    public function update()
    {   

        $id = $this->input->post('idrekap');        
        $is_saveschema = (int)$this->input->post('is_saveschema');

        $data = array(                
           'userid' => $this->user->info->ID,
           'updated_at' =>  date("Y-m-d H:i:s"),  
        );
            
        $dataRekap = array_merge($data,$this->getDataRekap()); 
        
        $idpegawai = $this->input->post('id_pegawai');
        $dataPegawai = array_merge($data,$this->getDataPegawaiSchema()); 
        $this->penggajian_model->updatePegawai($idpegawai, $dataPegawai);
        
   
        if ($this->penggajian_model->updateRekap($id, $dataRekap)) {
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
                'id_pegawai' => $this->input->post('id_pegawai'),
                'kopri_dw' => $this->input->post('kopri_dw'),
                'bpd_gianyar' => $this->input->post('bpd_gianyar'),
                'bpd_ubud' => $this->input->post('bpd_ubud'),
                'bpd_tampaksiring' => $this->input->post('bpd_tampaksiring'),
                'bpd_sukawati' => $this->input->post('bpd_sukawati'),
                'potongan_lain' => $this->input->post('potongan_lain'),
                'kop_melati' => $this->input->post('kop_melati'),
                'suka_duka' => $this->input->post('suka_duka'),
                'simp_voucher' => $this->input->post('simp_voucher'),
                'cicilan_barang' => $this->input->post('cicilan_barang'),
                'pinjaman_koperasi' => $this->input->post('pinjaman_koperasi'),
                'arisan_dw' => $this->input->post('arisan_dw'),
                'werdhi_sedana' => $this->input->post('werdhi_sedana'),
                'santunan_meninggal' => $this->input->post('santunan_meninggal'),
                'pinjaman_kop_naker' => $this->input->post('pinjaman_kop_naker'),
                'simpanan_kop_naker' => $this->input->post('simpanan_kop_naker'),
                'tabungan_mesra' => $this->input->post('tabungan_mesra'),
                'bpr_kanti' => $this->input->post('bpr_kanti'),
                'kop_sinar' => $this->input->post('kop_sinar'),
                'periode_gaji' => $this->input->post('periode_gaji'),
                'jenis_gaji' => $this->input->post('jenis_gaji'),
                'jenis_gaji_obj' => $this->input->post('jenis_gaji_obj'),
                'pendapatan' => $this->input->post('pendapatan'),
                'total_potongan' => $this->input->post('total_potongan'),
                'sisa_pendapatan' => $this->input->post('sisa_pendapatan'),
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


    public function finishPenggajian(){
		


		$result['error'] = false;
        $result['msg']   = 'Proses Penggajian Berhasil!';

		echo json_encode($result);

	}

    public function sendEmailGaji($idrekap = ""){
        //next update cari pendekatan lain block ini biar ga memberatkan server
       
        $msg = "Silakan download slip gaji dibawah ini, <br/> Admin";

        $dataEmail = $this->penggajian_model->showEmail($idrekap);


        $folder = "./testExcel/"; 
        foreach ($dataEmail as $value) {
            $dataUpdate = array(
                            "sendemail" => $value->sendemail + 1
                        );

            $this->penggajian_model->updateRekap($value->id,$dataUpdate);
            if($value->email!=""){
                 $file = $this->generateSlipGaji($value->periode_gaji,$value->jenis_gaji,$value->id_pegawai);
                 $dataEmail = array(
                    "email_send" => $value->email,
                    "email_bcc" => 'dode.agung.asmara@gmail.com',
                    "replayTo" => 'putu.ikha@gmail.com',
                    "subject" => 'Rekap Gaji Periode - '.$this->common->bln_indo($value->periode_gaji),
                    "message" => $msg,
                    "attach" => $folder.$file,
                    "createdAt" => date("Y/m/d")
                );
                //echo "<pre>"; print_r($dataEmail);
                $this->sendEmailQueueTable($dataEmail);
            }
            
        }

       

        $result['error'] = false;
        $result['msg']   = 'Email Added successfully';

        echo json_encode($result);

    }

	public function sendEmailQueueTable($dataEmail)
    {   
       
        return $this->penggajian_model->add_emailQueue($dataEmail);

        
    } 

    public function sendEmail() 
   {
        $dataEmail = $this->penggajian_model->get_emailQueue();
        foreach ($dataEmail->result() as $res) {
           //SEND ke CUSTOMER
            $replayto = "putu.ikha@gmail.com";
            //$emailCustomer = $res->email_send;
            $emailCustomer = 'dode.agung.asmara@gmail.com';
            $body = $res->message;
            $subject = $res->subject;
            $from = "putu.ikha@gmail.com";
            $replayto = "putu.ikha@gmail.com";
            $appName = "SiMenAga";
            $bcc = "dode.agung.asmara@gmai.com";
            $attachment = $_SERVER["DOCUMENT_ROOT"]."/".$res->attach;

            //echo "<pre>"; print_r($attachment);

            $this->common->send_email($subject, $body, $emailCustomer, $from,$replayto, $appName, "", $bcc, $attachment);

            $dataEmail = array(
                            "status" => 1
                        );
            $this->penggajian_model->update_emailQueue($res->id,$dataEmail);
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
