import { Component, OnInit, Inject } from '@angular/core';
import { selectOpt } from '../interfaces/selectOpt';
import { searchRec } from '../services/searchFaasRec.service';
import { landTaxTable } from '../interfaces/landTaxTable';
import { landTaxTableBldg } from '../interfaces/landTaxTableBldg';
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
import * as jwt_decode from 'jwt-decode';
import { genTaxDec } from '../services/genTaxDec.service';
import { bldgFaasTmp } from '../classes/bldgFaasTmp';
import { getPosHolders } from '../services/getPosHolders.service';
import * as writtenNumber from 'written-number';

var info: landTaxTable[] = [];
var infoBldg: landTaxTableBldg[] = [];
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
	clicked: boolean;
  clseSrch: boolean;
  faasmDwn: boolean;
  tdmDwn: boolean;
	holders: any;
	encoder: any;

  infoLs = new MatTableDataSource(info);
	infoBldgLs = new MatTableDataSource(infoBldg);
  ownerLs = new MatTableDataSource(owner);
  adminLs = new MatTableDataSource(admin);

  infoHeader: string[] = [
    'arpNo', 'pin', 'surveyNo', 'lotNo', 'blockNo',
    'streetNo', 'brgy', 'subd', 'city', 'province',
    'class', 'subclass', 'area', 'assessedVal', 'stat'
  ];

	infoBldg: string[] = [
		'arpNo', 'pin', 'brgy', 'subd', 'city',
    'province', 'kind', 'structType', 'bldgPermit', 'dateConstr',
    'storey', 'actualUse', 'assessedVal'
	]

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
    private taxDec: genTaxDec,
		private posHolders: getPosHolders) { }

  ngOnInit() {
    if(!localStorage.getItem('auth')) {
      window.location.href = '/'
    }
		this.posHolders.getPosHoldersCl('TAX DECLARATION').subscribe(res => {
			this.holders = res;
		});
		let obj: any = jwt_decode(localStorage.getItem('auth'));
		this.encoder = obj.name;
  }

	selectedRow = [];
	selectedOwner = [];
	selectedAdmin = [];

	resfaas: any;
	resowner: any;
	resadmin: any;
  genFaasBtn: boolean = false;

	tableRowSelected(row: any) {
		owner = [];
		admin = [];
		this.ownerLs = new MatTableDataSource(owner);
		this.adminLs = new MatTableDataSource(admin);
		this.selectedRow = [];
		this.selectedOwner = [];
		this.selectedAdmin = [];
		this.selectedRow.push(row);
		let ind: number;
		if(this.param1 == 'land') {
			ind = info.indexOf(row);
		} else {
			ind = infoBldg.indexOf(row);
		}
		_.forEach(this.resowner[ind], (arr: any) => {
			owner.push({
				ownName: arr.first_name + ' ' + arr.middle_name + ' ' + arr.last_name,
				ownAddress: arr.address,
				ownContact: arr.contact_no,
				ownTIN: arr.TIN
			});
		});
		_.forEach(owner, (arr: any) => {
			this.selectedOwner.push(arr);
		})
		_.forEach(admin, (arr: any) => {
			this.selectedAdmin.push(arr);
		})
		_.forEach(this.resadmin[ind], (arr: any) => {
			admin.push({
				admName: arr.first_name + ' ' + arr.middle_name + ' ' + arr.last_name,
				admAddress: arr.address,
				admContact: arr.contact_no,
				admTIN: arr.TIN
			});
		});
		this.ownerLs = new MatTableDataSource(owner);
		this.adminLs = new MatTableDataSource(admin);
		console.table(this.selectedRow);
		console.table(this.selectedOwner);
		console.table(this.selectedAdmin);
    this.genFaasBtn = true;
	}

  isVisible_spinner = false
  search() {
    if(this.req == "")
    {
      this.matDialog.open(DialogErr, {width: '300px', height: '180px', panelClass: 'custom-dialog-container', disableClose: true, data: 'Empty input' });
    }
    else {
      if(this.req != null) {
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
          info: '',
          sysCaller: 'RPTAS'
        }
				if (this.param2 == 'pin' || this.param2 == 'arpNo') {
					data.info = this.req.trim()
				} else {
					data.info = this.req
				}
        this.sRec.search(data).subscribe(res => {
          if(res.success) {
            this.resdata = res.data;
            this.resfaas = this.resdata.faas;
            this.resowner = this.resdata.owner;
            this.resadmin = this.resdata.admin;
            this.genFaasBtn = false;

            console.log(res)
            if (this.resfaas.length > 0 || this.resowner.length > 0 ||this.resadmin.length > 0) {
              switch(this.param1) {
  							case 'land':
  								_.forEach(this.resfaas, arr => {
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
  								this.infoLs = new MatTableDataSource(info);
  								break;
  							case 'building':
  								_.forEach(this.resfaas, arr => {
  									infoBldg.push({
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
  								this.infoBldgLs = new MatTableDataSource(infoBldg);
  								break;
  						}
              this.srchClse();
            } else {
              this.matDialog.open(DialogErr, { width: '300px', height: '180px', panelClass: 'custom-dialog-container', disableClose: true, data: 'Data not found' });
            }
          } else {
            this.matDialog.open(DialogErr, { width: '300px', height: '180px', panelClass: 'custom-dialog-container', disableClose: true, data: res.err });
          }
          this.isVisible_spinner = false
        });
      } else {
        this.matDialog.open(DialogErr, { width: '300px', height: '180px', panelClass: 'custom-dialog-container', disableClose: true, data: 'Empty input' });
      }
    }
  }

  srchIco() {
    var clientHeight = document.getElementById('search_db').clientHeight;
    var srchDb = document.getElementById("search_db");
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

  chooseInfo() {
    return (this.param1 == 'land') ? 'Land' : 'Building';
  }

  generateFaas() {
    if(this.param1 == 'land') {
      this.faas.generateLand({ id: this.resdata.faas[0].id }).subscribe(resp => {
				console.log(resp)
				let res = resp.faas;
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
        this.faas.fileLand(info);
      })
    } else {
      this.faas.generateBldg({ id: this.resdata.faas[0].id }).subscribe(res => {
        let data: bldgFaasTmp = {
          transaction_code: res.transaction_code,
          arp_no: res.arp_no,
          pin: res.pin_city + '-' + res.pin_district + '-' + res.pin_barangay + '-' + res.pin_section + '-' + res.pin_parcel + '-' + res.pin_building_no,
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
          land_owner: this.getOwners(this.resdata.owner[0]),
          land_oct_tct_no: res.land_oct_tct_no,
          land_survey_no: res.land_survey_no,
          land_lot_no: res.land_lot_no,
          land_block_no: res.land_block_no,
          land_arp_no: res.land_arp_no,
          land_area: res.land_area,
          kind_of_building: res.type,
          structural_type: res.building_type,
          building_permit_no: res.building_permit_no,
          permit_issue_date: res.building_permit_issue_date,
          condominium_certificate: res.condominium_cert_title,
          completion_issue_date: res.completion_cert_issue_date,
          occupancy_issue_date: res.occupancy_cert_issue_date,
          date_constructed: res.constructed_date,
          date_occupied: res.occupied_date,
          building_age: res.building_age,
          no_of_storeys: res.no_of_storey,
          floor1_area: ' ',
          floor2_area: ' ',
          floor3_area: ' ',
          floor4_area: ' ',
          total_floor_area: res.total_floor_area,
          bc_unit_construction_cost: res.bc_unit_construction_cost,
					bc_sub_total: res.bc_sub_total_construction_cost,
          depreciation_rate: res.depreciation_rate,
          depreciation_cost: res.depreciation_cost,
          ad_sub_total: res.ad_sub_total_additional_cost,
          total_percent_depreciation: res.total_percent_depreciated,
          depreciated_market_value: res.depreciated_market_value,
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
          date_created: res.date_created,
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
        for(var i = 1; i <= +res.no_of_storey; i++) {
          Object.keys(data).forEach(key => {
            if(key == ('floor' + i.toString() + '_area')) {
              data[key] = res.total_floor_area.toString();
            }
          })
        }
        this.faas.fileBldg(data);
      })
    }
  }

  generateTD() {
    let data: any = {
      param1: this.param1,
      id: this.resdata.faas[0].id
    }
    if(this.param1 == 'land') {
      this.taxDec.generateLand(data).subscribe(res => {
				console.log(res)
				let faas = res.faas;
				let admins = res.admins;
				let owners = res.owners;
        let tmp: taxDecTmp = {
          td_no: faas.arp_no,
          pin: faas.pin_city + '-' + faas.pin_district + '-' + faas.pin_barangay + '-' + faas.pin_section + '-' + faas.pin_parcel,
          owner_names: this.getOwners(owners),
          owner_tins: this.getOwnerTIN(owners),
          owner_addresses: this.getOwnerAddr(owners),
          owner_contact_nos: this.getOwnerContact(owners),
          admin_names: this.getAdmins(admins),
          admin_tins: this.getAdmTIN(admins),
          admin_addresses: this.getAdmAddr(admins),
          admin_contact_nos: this.getAdmContact(admins),
          street_no: faas.street_no,
          brgy_district: faas.barangay,
          oct_tct_no: faas.OCT_TCT_no,
          survey_no: faas.survey_no,
          condo_cert: '',
          lot_no: faas.lot_no,
          dated: (faas.date_created == '') ? '' : moment(faas.date_created).format('MM/DD/YYYY'),
          block_no: faas.block_no,
          north: faas.north,
          south: faas.south,
          east: faas.east,
          west: faas.west,
          s1: (this.param1 == 'land') ? 'x' : ' ',
          s2: (this.param1 == 'building') ? 'x' : ' ',
          s3: (this.param1 == 'machinery') ? 'x' : ' ',
          s4: (this.param1 == 'others') ? 'x' : ' ',
          no_of_storey: ' ',
          desc_mchn: ' ',
          desc_bldg: ' ',
          others_specify: ' ',
          class: faas.class,
          area: faas.area,
          market_val: faas.pa_market_value,
          actual_use: faas.pa_actual_use,
          assess_level: faas.pa_assessment_level,
          assessed_val: faas.pa_assessed_value,
          total_market_val: faas.pa_market_value,
          total_assessed_val: faas.pa_total_assessed_value,
          total_assessed_value_in_words: this.figureToWords(+faas.pa_total_assessed_value),
          tax: (faas.pa_status == 'TAXABLE') ? 'x' : ' ',
          exp: (faas.pa_status == 'EXEMPTED') ? 'x' : ' ',
          pa_effectivity_assess_quarter: faas.pa_effectivity_assess_quarter,
          pa_effectivity_assess_year: faas.pa_effectivity_assess_year,
          approved_by1: this.holders[0].holder_name,
          approver_title1: this.holders[0].position_name,
          approved_by2: this.holders[1].holder_name,
          approver_title2: this.holders[1].position_name,
          approved_by_date: faas.approved_by_date,
          previous_td_no: faas.superseded_td_no,
          previous_owner: faas.superseded_previous_owner,
          previous_assessed_value: faas.superseded_total_assessed_value,
          memoranda: faas.memoranda,
          diag_date_printed: moment(new Date()).format('MM/DD/YYYY'),
          diag_printed_by: this.encoder,
        }
        this.taxDec.file(tmp);
      })
    } else {

    }
  }

  getOwners(obj: any) {
    let res = '';
    if(obj.length > 0) {
			_.forEach(obj, arr => {
	      res = res + arr.first_name + ' ' + arr.middle_name + ' ' + arr.last_name + '\n';
	    })
	    return res;
		} else {
			return '';
		}
  }

  getOwnerContact(obj: any) {
    let res = '';
    if(obj.length > 0) {
			_.forEach(obj, arr => {
	      res = res + arr.contact_no + '\n';
	    })
	    return res;
		} else {
			return '';
		}
  }

  getOwnerAddr(obj: any) {
    let res = '';
    if(obj.length > 0) {
			_.forEach(obj, arr => {
	      res = res + arr.address + '\n';
	    })
	    return res;
		} else {
			return '';
		}
  }

  getOwnerTIN(obj: any) {
    let res = '';
    if(obj.length > 0) {
			_.forEach(obj, arr => {
	      res = res + arr.TIN + '\n';
	    });
	    return res;
		} else {
			return '';
		}
  }

  getAdmins(obj: any) {
    let res = '';
    if(obj.length > 0) {
			_.forEach(obj, arr => {
	      res = res + arr.first_name + ' ' + arr.middle_name + ' ' + arr.last_name + '\n';
	    })
			return res;
		} else {
			return '';
		}
  }

  getAdmContact(obj: any) {
    let res = '';
    if(obj.length > 0) {
			_.forEach(obj, arr => {
	      res = res + arr.contact_no + '\n';
	    })
	    return res;
		} else {
			return '';
		}
  }

  getAdmAddr(obj: any) {
    let res = '';
    if(obj.length > 0) {
			_.forEach(obj, arr => {
      	res = res + arr.address + '\n';
    	})
    	return res;
		} else {
			return '';
		}
  }

  getAdmTIN(obj: any) {
    let res = '';
    if(obj.length > 0) {
			_.forEach(obj, arr => {
	      res = res + arr.TIN + '\n';
	    });
	    return res;
		} else {
			return '';
		}
  }

	figureToWords(num: number) {
		// let wordNum = writtenNumber(num) + ' Pesos';
		// return wordNum;
		let wordNum = (writtenNumber(num)).split(' '),
				resVal = '';
		_.forEach(wordNum, (arr: any) => {
			if(arr != 'and') {
				resVal = resVal + arr.charAt(0).toUpperCase() + arr.slice(1) + ' ';
			}
		})
		resVal = resVal + 'Pesos';
		return resVal;
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

@Component({
  selector:'app-dialog-faas-rec-err',
  templateUrl: './dialog-faas-rec-err.html',
  styleUrls: ['./dialog-faas-rec-err.scss']

})
export class DialogErr {
	okBtn: boolean;
  msg: string = '\t ' + this.data;
  constructor(private dialogRef: MatDialogRef<DialogErr>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  close() {
    this.dialogRef.close()
  }
}
