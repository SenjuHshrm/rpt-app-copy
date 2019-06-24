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
import { genFaas } from '../services/genFaas.service';
import { landFaasTmp } from '../classes/landFaasTmp';
import { taxDecTmp } from '../classes/taxDecTmp';
import * as moment from 'moment';
import { genTaxDec } from '../services/genTaxDec.service';

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
  resdata: any;

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

  constructor(private sRec: searchRec,
    private matDialog: MatDialog,
    private route: Router,
    private faas: genFaas,
    private taxDec: genTaxDec) { }

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
      info: this.req,
      sysCaller: 'RPTAS'
    }
    this.sRec.search(data).subscribe(res => {
      this.resdata = res.data;
      let faas = this.resdata.faas;
      let resOwner = this.resdata.owner;
      let resAdmin = this.resdata.admin;
      console.log(this.resdata)
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
    if(this.param1 == 'land') {
      this.faas.generateLand({ id: this.resdata.faas[0].id }).subscribe(res => {
        let info: landFaasTmp = {
          transaction_code: res.transaction_code,
          arp_no: res.arp_no,
          pin: res.pin_city + '-' + res.pin_district + '-' + res.pin_barangay + '-' + res.pin_section + '-' + res.pin_parcel,
          otc_tct_no: res.OCT_TCT_no,
          oct_tct_date: ' ',
          survey_no: res.survey_no,
          lot_no: res.lot_no,
          block: res.block_no,
          owner_names: this.getOwners(this.resdata.owner[0]),
          owner_addresses: this.getOwnerAddr(this.resdata.owner[0]),
          owner_contact_nos: this.getOwnerContact(this.resdata.owner[0]),
          owner_tins: this.getOwnerTIN(this.resdata.owner[0]),
          admin_names: this.getAdmins(this.resdata.admin[0]),
          admin_addresses: this.getAdmAddr(this.resdata.admin[0]),
          admin_contact_nos: this.getAdmContact(this.resdata.admin[0]),
          admin_tins: this.getAdmTIN(this.resdata.admin[0]),
          street_no: res.street_no,
          barangay_district: res.barangay,
          municipality: res.city,
          province_city: res.province,
          north: res.north,
          east: res.east,
          south: res.south,
          west: res.west,
          class: res.class,
          sub_class: res.sub_class,
          area: res.area,
          unit_value: res.unit_value,
          base_market_value: res.base_market_value,
          total_base_market_value: res.total_base_market_value,
          pa_actual_use: res.pa_actual_use,
          pa_market_value: res.pa_market_value,
          pa_assessment_level: res.pa_assessment_level,
          pa_assessed_value: res.pa_assessed_value,
          pa_total_assessed_value: res.pa_total_assessed_value,
          pa_effectivity_assess_quarter: res.pa_effectivity_assess_quarter,
          pa_effectivity_assess_year: res.pa_effectivity_assess_year,
          appraised_by: res.appraised_by,
          appraised_by_date: res.appraised_by_date,
          recommending: res.recommending,
          recommending_date: res.recommending_date,
          approved_by: res.approved_by,
          approved_by_date: res.approved_by_date,
          memoranda: res.memoranda,
          date_created: moment(res.date_created).format('MM-DD-YYYY'),
          entry_by: res.encoder_id,
          superseded_pin: res.superseded_pin,
          superseded_arp_no: res.superseded_arp_no,
          superseded_td_no: res.superseded_td_no,
          superseded_total_assessed_value: res.superseded_total_assessed_value,
          superseded_previous_owner: res.superseded_previous_owner,
          superseded_effectivity_assess: res.superseded_effectivity_assess,
          superseded_ar_page_no: res.superseded_ar_page_no,
          superseded_recording_personnel: res.superseded_recording_personnel,
          superseded_date: res.superseded_date,
        }
        console.log(info)
        this.faas.file(info);
      })
    } else {
      
    }
  }

  generateTD() {
    let data: any = {
      param1: this.param1,
      id: this.resdata.faas[0].id
    }
    if(this.param1 == 'land') {
      this.taxDec.generateLand(data).subscribe(res => {
        let tmp: taxDecTmp = {
          td_no: '',
          pin: '',
          owner_names: '',
          owner_tins: '',
          owner_addresses: '',
          owner_contact_nos: '',
          admin_names: '',
          admin_tins: '',
          admin_addresses: '',
          admin_contact_nos: '',
          street_no: '',
          brgy_district: '',
          oct_tct_no: '',
          survey_no: '',
          condo_cert: '',
          lot_no: '',
          dated: '',
          block_no: '',
          north: '',
          south: '',
          east: '',
          west: '',
          s1: '',
          s2: '',
          s3: '',
          s4: '',
          no_of_storey: '',
          desc_mchn: '',
          desc_bldg: '',
          others_specify: '',
          class: '',
          area: '',
          market_val: '',
          actual_use: '',
          assess_level: '',
          assessed_val: '',
          total_market_val: '',
          total_assessed_val: '',
          total_assessed_value_in_words: '',
          tax: '',
          exp: '',
          pa_effectivity_assess_quarter: '',
          pa_effectivity_assess_year: '',
          approved_by1: '',
          approver_title1: '',
          approved_by2: '',
          approver_title2: '',
          approved_by_date: '',
          previous_td_no: '',
          previous_owner: '',
          previous_assessed_value: '',
          memoranda: '',
          diag_date_printed: '',
          diag_printed_by: '',
        }
        this.taxDec.file(tmp);
      })
    } else {
      
    }
  }

  getOwners(obj: any) {
    let res = '';
    _.forEach(obj, arr => {
      res = res + arr.first_name + ' ' + arr.middle_name + ' ' + arr.last_name + '\n';
    })
    return res;
  }

  getOwnerContact(obj: any) {
    let res = '';
    _.forEach(obj, arr => {
      res = res + arr.contact_no + '\n';
    })
    return res;
  }

  getOwnerAddr(obj: any) {
    let res = '';
    _.forEach(obj, arr => {
      res = res + arr.address + '\n';
    })
    return res;
  }

  getOwnerTIN(obj: any) {
    let res = '';
    _.forEach(obj, arr => {
      res = res + arr.TIN + '\n';
    });
    return res;
  }

  getAdmins(obj: any) {
    let res = '';
    _.forEach(obj, arr => {
      res = res + arr.first_name + ' ' + arr.middle_name + ' ' + arr.last_name + '\n';
    })
    return res;
  }

  getAdmContact(obj: any) {
    let res = '';
    _.forEach(obj, arr => {
      res = res + arr.contact_no + '\n';
    })
    return res;
  }

  getAdmAddr(obj: any) {
    let res = '';
    _.forEach(obj, arr => {
      res = res + arr.address + '\n';
    })
    return res;
  }

  getAdmTIN(obj: any) {
    let res = '';
    _.forEach(obj, arr => {
      res = res + arr.TIN + '\n';
    });
    return res;
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
