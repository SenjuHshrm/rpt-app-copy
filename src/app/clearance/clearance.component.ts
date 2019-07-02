import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { selectOpt } from '../interfaces/selectOpt';
import { searchRec } from '../services/searchFaasRec.service';
import { landTaxTable } from '../interfaces/landTaxTable';
import { landTaxInfOwn } from '../interfaces/landTaxInfOwn';
import { landTaxInfAdm } from '../interfaces/landTaxInfAdm';
import { landTaxTableBldg } from '../interfaces/landTaxTableBldg';
import { getPosHolders } from '../services/getPosHolders'
import { MatTableDataSource } from '@angular/material';
import { lTaxClearance } from '../classes/lTaxClearance';
import * as _ from 'lodash';
import * as jwt_decode from 'jwt-decode';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { genLandTaxCl } from '../services/genLandTaxCl';
// import docxtemplater from 'docxtemplater';
// import * as JSZip from 'jszip';
// import * as JSZipUtils from 'jszip-utils';
import * as moment from 'moment';
import { DomSanitizer } from '@angular/platform-browser';
import { Pipe, PipeTransform } from '@angular/core';
import { getClFile } from '../services/getClFile.service';
import { Router } from '@angular/router';

var ltTableLs: landTaxTable[] = []
var ltTableBldgLs: landTaxTableBldg[] = []
var ltTableInfOwner: landTaxInfOwn[] = []
var ltTableInfAdmin: landTaxInfAdm[] = []

@Component({
  selector: 'app-clearance',
  templateUrl: './clearance.component.html',
  styleUrls: ['./clearance.component.scss'],
  //styles: [''],
  //encapsulation: ViewEncapsulation.None,
})
export class ClearanceComponent implements OnInit {
  //clearanceTble = '';

  LTTable = new MatTableDataSource(ltTableLs);
  LTTableInfOwn = new MatTableDataSource(ltTableInfOwner);
  LTTableInfAdm = new MatTableDataSource(ltTableInfAdmin);

  LTTableBldg = new MatTableDataSource(ltTableBldgLs);

  input1: string;
  amount: string;
  CTONo: string;
  dated: string;
  requestor: string;
  purpose: string;
  encoder1: string;
  date: string;
  certfee: string;
  amt: string;
  orNo: string;
  remarks: string;
  posHolders: any;
	selectedRow = [];
	selectedOwner = [];
	selectedAdmin = [];

	faas: any;
	owner: any;
	admin: any;


  lTaxHeader: string[] = [
    'arpNo', 'pin', 'surveyNo', 'lotNo', 'blockNo',
    'streetNo', 'brgy', 'subd', 'city', 'province',
    'class', 'subclass', 'area', 'assessedVal', 'stat'
  ];

  lTaxBldgHeader: string[] = [
    'arpNo', 'pin', 'brgy', 'subd', 'city',
    'province', 'kind', 'structType', 'bldgPermit', 'dateConstr',
    'storey', 'actualUse', 'assessedVal'
  ];

  lTaxInfHeaderOwn: string[] = [
    'ownName', 'ownAddress', 'ownContact', 'ownTIN'
  ];

  lTaxInfHeaderAdm: string[] = [
    'admName', 'admAddress', 'admContact', 'admTIN'
  ];

  constructor(private srchRec: searchRec,
    private genCL: genLandTaxCl,
    private route: Router,
    private gPos: getPosHolders,
    public matDialog: MatDialog) {}

  ngOnInit() {
    if(localStorage.getItem('auth')) {
      let obj = jwt_decode(localStorage.getItem('auth'));
      this.encoder1 = obj.name;
      this.gPos.getPosHoldersCl().subscribe(res => {
        this.posHolders = res;
      })
    } else {
      window.location.href = '/'
    }
  }

  param1: string = 'land';
  param2: string = 'pin';
  req: string;

  params1: selectOpt[] = [
    { value: 'land', viewVal: 'Land' },
    { value: 'building', viewVal: 'Building' },
  ];
  params2: selectOpt[] = [
    { value: 'pin', viewVal: 'PIN' },
    { value: 'arpNo', viewVal: 'ARP No.' },
    { value: 'name', viewVal: 'Name' },
  ];

  prps: selectOpt[] = [
    { value: 's1', viewVal: 'Cancellation/Registration of mortgage contract' },
    { value: 's2', viewVal: 'Transfer of ownership' },
    { value: 's3', viewVal: 'Bank Loan/Pag-ibig Loan' },
    { value: 's4', viewVal: 'Business Permit' },
    { value: 's5', viewVal: 'Others: For whatever legal purpose' },
  ]

	tableRowSelected(row: any) {
		ltTableInfOwner = [];
		ltTableInfAdmin = [];
		this.LTTableInfOwn = new MatTableDataSource(ltTableInfOwner);
		this.LTTableInfAdm = new MatTableDataSource(ltTableInfAdmin);
		this.selectedRow = [];
		this.selectedOwner = [];
		this.selectedAdmin = [];
		this.selectedRow.push(row);
		let ind: number;
		if(this.param1 == 'land') {
			ind = ltTableLs.indexOf(row);
		} else {
			ind = ltTableBldgLs.indexOf(row);
		}
		_.forEach(this.owner[ind], (arr: any) => {
			ltTableInfOwner.push({
				ownName: arr.first_name + ' ' + arr.middle_name + ' ' + arr.last_name,
				ownAddress: arr.address,
				ownContact: arr.contact_no,
				ownTIN: arr.TIN
			});
		});
		_.forEach(ltTableInfOwner, (arr: any) => {
			this.selectedOwner.push(arr);
		})
		_.forEach(ltTableInfAdmin, (arr: any) => {
			this.selectedAdmin.push(arr);
		})
		_.forEach(this.admin[ind], (arr: any) => {
			ltTableInfAdmin.push({
				admName: arr.first_name + ' ' + arr.middle_name + ' ' + arr.last_name,
				admAddress: arr.address,
				admContact: arr.contact_no,
				admTIN: arr.TIN
			});
		});
		this.LTTableInfOwn = new MatTableDataSource(ltTableInfOwner);
		this.LTTableInfAdm = new MatTableDataSource(ltTableInfAdmin);
		console.table(this.selectedRow);
		console.table(this.selectedOwner);
		console.table(this.selectedAdmin);
	}

  clicked = false
  clckd = false
  isVisible_spinner = false
  search() {
    this.clicked = false;
    this.isVisible_spinner = true;
    ltTableLs = []
    ltTableBldgLs = []
    ltTableInfOwner = []
    ltTableInfAdmin = []
    this.LTTable = new MatTableDataSource(ltTableLs);
    this.LTTableInfOwn = new MatTableDataSource(ltTableInfOwner);
    this.LTTableInfAdm = new MatTableDataSource(ltTableInfAdmin);
    this.LTTableBldg = new MatTableDataSource(ltTableBldgLs);
    let reqdata: any = {
      SearchIn: this.param1,
      SearchBy: this.param2,
      info: this.req,
      sysCaller: 'LAND TAX'
    }
    this.srchRec.search(reqdata).subscribe(res => {
      let resdata = res.data;
      this.faas = resdata.faas;
      this.owner = resdata.owner;
      this.admin = resdata.admin;
      console.table(resdata);
      switch(this.param1) {
        case 'land':
          _.forEach(this.faas, (arr: any)=> {
            ltTableLs.push({
              arpNo: arr.ARPNo,
              pin: arr.PIN,
              surveyNo: arr.SurveyNo,
              lotNo: arr.LotNo,
              blockNo: arr.BlockNo,
              streetNo: arr.StreetNo,
              brgy: arr.Barangay,
              subd: arr.Subdivision,
              city: arr.City,
              province: arr.Province,
              class: arr.Class,
              subclass: arr.SubClass,
              area: arr.Area,
              assessedVal: arr.AssessedValue,
              stat: arr.Status
            });
          });
          this.LTTable = new MatTableDataSource(ltTableLs);
          break;
        case 'building':
          _.forEach(this.faas, (arr: any) => {
            ltTableBldgLs.push({
              arpNo: arr.ARPNo,
              pin: arr.PIN,
              brgy: arr.Barangay,
              subd: arr.Subdivision,
              city: arr.City,
              province: arr.Province,
              kind: arr.Kind,
              structType: arr.StructuralType,
              bldgPermit: arr.BldgPermit,
              dateConstr: arr.DateConstructed,
              storey: arr.Storey,
              actualUse: arr.ActualUse,
              assessedVal: arr.AssessedValue
            });
          });
          this.LTTableBldg = new MatTableDataSource(ltTableBldgLs);
          break;
      }
      this.isVisible_spinner = false;
      this.clicked = false;
    });
  }

  genCl() {
    console.log(this.date);
    let data: lTaxClearance = {
      current_date: moment(new Date).format('MM-DD-YYYY'),
      owner_names: ' ',
      pin: ' ',
      arp_no: ' ',
      location: ' ',
      assessed_value: ' ',
      payment_reason: this.input1,
      total_amount: this.amount,
      cto_no: this.CTONo,
      dated: moment(this.dated).format('MM/DD/YYYY'),
      name_of_requestor: this.requestor,
      s1: ' ',
      s2: ' ',
      s3: ' ',
      s4: ' ',
      s5: ' ',
      verified_by: this.encoder1,
      by_name1: this.posHolders[0].holder_name,
      by_title1: this.posHolders[0].position_name,
      certification_fee: this.certfee,
      or_no: this.orNo,
      date: moment(this.date).format('MM/DD/YYYY'),
      amount: this.amt,
      by_name2: this.posHolders[1].holder_name,
      by_title2: this.posHolders[1].position_name,
      remarks: this.remarks
    };
    switch(this.purpose) {
      case 's1':
        data.s1 = 'x';
        break;
      case 's2':
        data.s2 = 'x';
        break;
      case 's3':
        data.s3 = 'x';
        break;
      case 's4':
        data.s4 = 'x';
        break;
      case 's5':
        data.s5 = 'x';
        break;
    }
		// switch(this.param1) {
		// 	case 'land':
		//
		// 		break;
		// 	case 'building':
		//
		// 		break;
		// }
    this.genCL.loadFile(data);
  }

  getOwners(): string {
    return (ltTableInfOwner.length > 1) ? ltTableInfOwner[0].ownName + ' ET AL' : ltTableInfOwner[0].ownName ;
  }

}

@Component({
  selector: 'app-dialog-clearance',
  templateUrl: 'dialog-clearance.html'
})


export class DialogClearance implements OnInit{

  docxSrc: any;

  constructor(
    public dialogRef: MatDialogRef<DialogClearance>,
    @Inject(MAT_DIALOG_DATA) public genData: any,
    private gC: getClFile
  ) {}

  ngOnInit() {
    // console.log(this.genData)
    let req = {
      file: this.genData.filename + '.pdf'
    }
    this.gC.getFile(req).subscribe(res => {
      console.log(res);
      this.docxSrc = 'data:pdf;base64,' + res.file;
    })

    // this.docxSrc = 'http://192.168.100.24:5000/api/get-file/land-tax/' + this.genData.filename + '.pdf';
    // this.docxSrc = 'data:document;base64,' + this.genData
  }

}

@Pipe({ name: 'docxPipe' })
export class DialogClearancePipe implements PipeTransform  {
  constructor(private sanitizer: DomSanitizer) { }
  transform(value: any) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(value);
  }
}
