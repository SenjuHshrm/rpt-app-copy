import { Component, OnInit, Inject } from '@angular/core';
import { selectOpt } from '../interfaces/selectOpt';
import { searchRec } from '../services/searchFaasRec.service';
import { landTaxTable } from '../interfaces/landTaxTable';
import { landTaxInfOwn } from '../interfaces/landTaxInfOwn';
import { landTaxInfAdm } from '../interfaces/landTaxInfAdm';
import { MatTableDataSource } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as _ from 'lodash';
import { Router } from '@angular/router';

var info: landTaxTable[] = [];
var owner: landTaxInfOwn[] = [];
var admin: landTaxInfAdm[] = [];


@Component({
  selector: 'app-faas-rec',
  templateUrl: './faas-rec.component.html',
  styleUrls: ['./faas-rec.component.scss']
})
export class FaasRecComponent implements OnInit {

  param1: string = 'land';
  param2: string = 'pin';
  req: string;

  infoLs = new MatTableDataSource(info);
  ownerLs = new MatTableDataSource(owner);
  adminLs = new MatTableDataSource(admin);

  infoHeader: string[] = [
    'arpNo', 'pin', 'surveyNo', 'lotNo', 'blockNo',
    'streetNo', 'brgy', 'subd', 'city', 'province',
    'class', 'subclass', 'area', 'assessedVal', 'stat'
  ];

  ownerHeader: string[] = [
    'ownName', 'ownAddress', 'ownContact', 'ownTIN'
  ];

  adminHeader: string[] = [
    'admName', 'admAddress', 'admContact', 'admTIN'
  ];

  params1: selectOpt[] = [
    { value: 'land', viewVal: 'Land' },
    { value: 'building', viewVal: 'Building' },
  ];
  params2: selectOpt[] = [
    { value: 'pin', viewVal: 'PIN' },
    { value: 'arpNo', viewVal: 'ARP No.' },
    { value: 'name', viewVal: 'Name' },
  ];

  constructor(private sRec: searchRec, private matDialog: MatDialog, private route: Router) { }

  ngOnInit() {
    if(!localStorage.getItem('auth')) {
      window.location.href = '/'
    }
  }

  isVisible_spinner = false
  search() {
    this.isVisible_spinner = true
    info = [];
    owner = [];
    admin = [];
    this.infoLs = new MatTableDataSource(info);
    this.ownerLs = new MatTableDataSource(owner);
    this.adminLs = new MatTableDataSource(admin);
    let data: any = {
      SearchIn: this.param1,
      SearchBy: this.param2,
      info: this.req
    }
    this.sRec.search(data).subscribe(res => {
      let resdata = res.data;
      let faas = resdata.faas;
      let resOwner = resdata.owner;
      let resAdmin = resdata.admin;
      console.log(resdata)
      _.forEach(faas, arr => {
        info.push({
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
      _.forEach(resOwner, arr => {
        _.forEach(arr, arr=> {
          owner.push({
            ownName: arr.first_name + ' ' + arr.middle_name + ' ' + arr.last_name,
            ownAddress: arr.address,
            ownContact: arr.contact,
            ownTIN: arr.TIN
          });
        });
      });
      _.forEach(resAdmin, arr => {
        _.forEach(arr, arr => {
          admin.push({
            admName: arr.first_name + ' ' + arr.middle_name + ' ' + arr.last_name,
            admAddress: arr.address,
            admContact: arr.contact,
            admTIN: arr.TIN
          });
        });
      });
      this.infoLs = new MatTableDataSource(info);
      this.ownerLs = new MatTableDataSource(owner);
      this.adminLs = new MatTableDataSource(admin);
      this.isVisible_spinner = false
    });
  }

  chooseInfo() {
    return (this.param1 == 'land') ? 'Land' : 'Building';
  }

  generateFaas() {
    this.matDialog.open(DialogFaasRecF, {
      width: '80%',
      height: '90%',
      data: ''
    })
  }

  generateTD() {
    this.matDialog.open(DialogFaasRecTD, {
      width: '80%',
      height: '90%',
      data: ''
    })
  }

}

@Component({
  selector: 'app-dialog-faas-rec-faas',
  templateUrl: './dialog-faas-rec-faas.html'
})
export class DialogFaasRecF implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<DialogFaasRecF>,
    @Inject(MAT_DIALOG_DATA)public data: any) { }
  ngOnInit() {

  }
}

@Component({
  selector: 'app-dialog-faas-rec-td',
  templateUrl: './dialog-faas-rec-td.html'
})
export class DialogFaasRecTD implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<DialogFaasRecTD>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {

  }
}
