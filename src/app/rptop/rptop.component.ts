import { Component, OnInit } from '@angular/core';
import * as _moment from 'moment';
import { selectOpt } from '../interfaces/selectOpt';
import { searchRec } from '../services/searchFaasRec.service';
import { landTaxTable } from '../interfaces/landTaxTable';
import { landTaxInfOwn } from '../interfaces/landTaxInfOwn';
import { landTaxInfAdm } from '../interfaces/landTaxInfAdm';
import { getPosHolders } from '../services/getPosHolders.service';
import { MatTableDataSource, MatTab } from '@angular/material';
import * as _ from 'lodash';
import * as jwt_decode from 'jwt-decode';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { sortAscendingPriority } from '@angular/flex-layout';
import { throwError } from 'rxjs';

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

	isVisible_spinner: boolean;

  encoder1: string;
  posHolders: any;

  value: string;
  yearPay: string;

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
      let obj: any = jwt_decode(localStorage.getItem('auth'));
      this.encoder1 = obj.name;
      this.gPos.getPosHoldersCl("RPTOP").subscribe(res => {
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

	search() {

	}

  addCompYear(){
    let basic = Number(this.value) * 0.1;

    let monthPay = basic / 12;

    if (moment(this.yearPay, 'YYYY').isSame(moment(), 'year')){

      let firstHalfPenalty = 0;
      let secondHalfPenalty = 0;

      let firstHalfPendisc = 0;
      let secondHalfPendisc = 0;

      let firstHalfPercent = 25 * (moment().quarter() - 1);
      let secondHalfPercent = 100 - firstHalfPercent;

      let firstHalfBasic = firstHalfPercent / 100 * basic;
      let secondHalfBasic = secondHalfPercent / 100 * basic;

      let firstHalfTotal = 0;
      let secondHalfTotal = 0;

      let ctr = 0;
      for(let dateCtr = moment(this.yearPay + '01', 'YYYYMM');
          dateCtr.isBefore(moment((Number(this.yearPay)+1), 'YYYY'), 'year');
          dateCtr.add(1, 'month')){

        if(dateCtr.quarter() < moment().quarter()){
          firstHalfPenalty = (Math.ceil(moment().diff(dateCtr, 'month', true)) * 2);
          firstHalfPendisc = firstHalfPendisc + (firstHalfPenalty / 100 * monthPay);

        }else{
          secondHalfPenalty = -10;
          secondHalfPendisc = secondHalfPendisc + (secondHalfPenalty / 100 * monthPay);

        }
      };

      firstHalfTotal = firstHalfBasic + firstHalfPendisc;
      secondHalfTotal = secondHalfBasic + secondHalfPendisc;

      ltRptopComp.push({
        yearPay: firstHalfPercent.toString() + '% ' + this.yearPay,
        basic: firstHalfBasic.toString(),
        pendisc: firstHalfPendisc.toString(),
        total: firstHalfTotal.toString()
      });

      ltRptopComp.push({
        yearPay: secondHalfPercent.toString() + '% ' + this.yearPay,
        basic: secondHalfBasic.toString(),
        pendisc: secondHalfPendisc.toString(),
        total: secondHalfTotal.toString()
      });

    }else if (moment(this.yearPay, 'YYYY').isBefore(moment(), 'year')) {

      let penalty = 0;
      let pendisc = 0;
      let total = 0;

      for(let dateCtr = moment(this.yearPay + '01', 'YYYYMM');
          dateCtr.isBefore(moment((Number(this.yearPay)+1), 'YYYY'), 'year');
          dateCtr.add(1, 'month')){

        penalty = (Math.ceil(moment().diff(dateCtr, 'month', true)) * 2);
        penalty = (penalty > 72) ? (72) : (penalty);

        pendisc = pendisc + (penalty / 100 * monthPay);

      };

      total = basic + pendisc;

      ltRptopComp.push({
        yearPay: this.yearPay,
        basic: basic.toFixed(2).toString(),
        pendisc: pendisc.toFixed(2).toString(),
        total: total.toFixed(2).toString()
      });

    }else if (moment(this.yearPay, 'YYYY').isAfter(moment(), 'year')) {

      let penalty = 0;
      let pendisc = 0;
      let total = 0;

      for(let dateCtr = moment(this.yearPay + '01', 'YYYYMM');
          dateCtr.isBefore(moment((Number(this.yearPay)+1), 'YYYY'), 'year');
          dateCtr.add(1, 'month')){

        penalty = -10

        pendisc = pendisc + (penalty / 100 * monthPay);

      };

      total = basic + pendisc;

      ltRptopComp.push({
        yearPay: this.yearPay,
        basic: basic.toFixed(2).toString(),
        pendisc: pendisc.toFixed(2).toString(),
        total: total.toFixed(2).toString()
      });

    }

    this.LTTableRptopComp = new MatTableDataSource(ltRptopComp)
  }

  srchIco() {
    var clientHeight = document.getElementById('search_db').clientHeight;
    var srchDb = document.getElementById("search_db");
    //var clrDb = document.getElementById("clrnce_db");
    var bckgrnd = document.getElementById("bgOverlay");
    var wheight = document.body.clientHeight;
    var wWidth = document.body.clientWidth;
    var wheight50 = wheight / 2;
    var wWidth50 = wWidth / 2;
    var pos = -clientHeight - 1100;
    var id = setInterval(frame, 0.1);
    function frame() {
        if (pos >= Math.round(wheight50)) {
          clearInterval(id);
        } else {
          pos+=23;
          srchDb.style.top = pos / 3 + 'px';
          srchDb.style.display = "block";
          //clrDb.style.display = 'none'
          bckgrnd.style.display = 'block';
        }
      }
  }

  srchClse() {
    var elem = document.getElementById("search_db");
    var bckgrnd = document.getElementById("bgOverlay");
    var clientHeight = document.getElementById('search_db').clientHeight;
    var id = setInterval(frame, 0.1);
    function frame() {
      //
      if(Math.round(clientHeight) < -1100) {
        bckgrnd.style.display = 'none';
        elem.style.display = 'none';
        clearInterval(id);
      } else {
        clientHeight-=23;
        elem.style.top = clientHeight / 3 + 'px';
      }
    }
  }
}
