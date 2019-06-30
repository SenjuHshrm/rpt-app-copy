import { Component, OnInit } from '@angular/core';
import * as _moment from 'moment';
import { selectOpt } from '../interfaces/selectOpt';
import { searchRec } from '../services/searchFaasRec.service';
import { landTaxTable } from '../interfaces/landTaxTable';
import { landTaxInfOwn } from '../interfaces/landTaxInfOwn';
import { landTaxInfAdm } from '../interfaces/landTaxInfAdm';
import { getPosHolders } from '../services/getPosHolders'
import { MatTableDataSource, MatTab } from '@angular/material';
import * as _ from 'lodash';
import * as jwt_decode from 'jwt-decode';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { sortAscendingPriority } from '@angular/flex-layout';

const moment = _moment;

//might put to /interfaces later
interface rptopComp {
  yearPay: string;
  basic: string;
  pendisc: string;
  total: string;
}

var ltTableLs: landTaxTable[] = []
var ltTableInfOwner: landTaxInfOwn[] = []
var ltTableInfAdmin: landTaxInfAdm[] = []
var ltRptopComp: rptopComp[] = []

@Component({
  selector: 'app-rptop',
  templateUrl: './rptop.component.html',
  styleUrls: ['./rptop.component.scss'],
})
export class RPTOPComponent implements OnInit {

  LTTable = new MatTableDataSource(ltTableLs);
  LTTableInfOwn = new MatTableDataSource(ltTableInfOwner);
  LTTableInfAdm = new MatTableDataSource(ltTableInfAdmin);
  LTTableRptopComp = new MatTableDataSource(ltRptopComp);

  encoder1: string;
  posHolders: any;

  value: string;
  yearPay: string;
  basic: number;
  pendisc: number;
  total: number;

  lTaxHeader: string[] = [
    'arpNo', 'pin', 'surveyNo', 'lotNo', 'blockNo',
    'streetNo', 'brgy', 'subd', 'city', 'province',
    'class', 'subclass', 'area', 'assessedVal', 'stat'
  ];

  lTaxInfHeaderOwn: string[] = [
    'ownName', 'ownAddress', 'ownContact', 'ownTIN'
  ];

  lTaxInfHeaderAdm: string[] = [
    'admName', 'admAddress', 'admContact', 'admTIN'
  ];

  computationHeader: string[] = [
    'yearPay', 'basic', 'pendisc', 'total'
  ];

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

  addCompYear(){
    this.basic = Number(this.value) * 0.1;
    this.pendisc = 0;

    let monthPay = this.basic/12;
    let penalty = 0;

    for(let dateCtr = moment(this.yearPay + '01', 'YYYYMM');
        dateCtr.isBefore(moment((Number(this.yearPay)+1), 'YYYY'), 'year');
        dateCtr.add(1, 'month')){
      
      penalty = (Math.ceil(moment().diff(dateCtr, 'month', true)) * 2);
      penalty = (penalty > 72) ? (72) : (penalty);

      this.pendisc = this.pendisc + (penalty / 100 * monthPay);
      
    };

    this.total = this.basic + this.pendisc;

    ltRptopComp.push({
      yearPay: this.yearPay,
      basic: this.basic.toString(),
      pendisc: this.pendisc.toString(),
      total: this.total.toString()
    });

    this.LTTableRptopComp = new MatTableDataSource(ltRptopComp)
  }
}