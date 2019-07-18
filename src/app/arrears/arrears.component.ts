import { Component, OnInit } from '@angular/core';
import * as _moment from 'moment';
import { selectOpt } from '../interfaces/selectOpt';
import { searchRec } from '../services/searchFaasRec.service';
import { landTaxTable } from '../interfaces/landTaxTable';
import { landTaxInfOwn } from '../interfaces/landTaxInfOwn';
import { landTaxInfAdm } from '../interfaces/landTaxInfAdm';
import { getPosHolders } from '../services/getPosHolders';
import { MatTableDataSource, MatTab } from '@angular/material';
import * as _ from 'lodash';
import * as jwt_decode from 'jwt-decode';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { sortAscendingPriority } from '@angular/flex-layout';
import { throwError } from 'rxjs';

var ltTableLs: landTaxTable[] = []
var ltTableInfOwner: landTaxInfOwn[] = []
var ltTableInfAdmin: landTaxInfAdm[] = []

@Component({
  selector: 'app-arrears',
  templateUrl: './arrears.component.html',
  styleUrls: ['./arrears.component.scss']
})
export class ArrearsComponent implements OnInit {

  LTTable = new MatTableDataSource(ltTableLs);
	LTTableInfOwn = new MatTableDataSource(ltTableInfOwner);
	LTTableInfAdm = new MatTableDataSource(ltTableInfAdmin);

  encoder1: string;
	posHolders: any;

	sum: number;
	yearsToPay: number;
	frequency: string;
	installment: number;
  srchMD: boolean;
  addMD: boolean;

  lTaxHeader: string[] = [
		'arpNo', 'pin', 'surveyNo', 'lotNo', 'blockNo',
		'streetNo', 'brgy', 'subd', 'city', 'province',
		'class', 'subclass', 'area', 'assessedVal', 'stat'
	];

	frequencies: selectOpt[] = [
		{value: '1', viewVal: 'Yearly'},
		{value: '4', viewVal: 'Quarterly'},
		{value: '12', viewVal: 'Monthly'},
	]

  constructor(private srchRec: searchRec,
		private route: Router,
		private gPos: getPosHolders) { }

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

  computeInstallment(){

  }

  isVisible_spinner: boolean = false;
  search(){
    this.isVisible_spinner = true;
  }
}
