import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as _ from 'lodash';
import { selectOpt } from '../interfaces/selectOpt';
import { landOwner } from '../interfaces/landOwner';
import { adminOwner } from '../interfaces/adminOwner';
import { stripInfo } from '../interfaces/stripInfo';
import { improvementInfo } from '../interfaces/improvementInfo';
import { marketValue } from '../interfaces/marketValue';
import { pincheck } from '../services/pincheck.service';
import { getMarketValues } from '../services/getMarketValues.service';
import { assessLand } from '../services/assesssLand.service';
import { getPosHolders } from  '../services/getPosHolders.service';
import { MatDialog } from '@angular/material/dialog';
import { LndAsmtSearch } from './dialog-search/lndasmt-search';
import { genFaas } from '../services/genFaas.service';
import { LndAsmtPending } from './dialog-pending/lndasmt-pending';
import { landAsmtDataTemp } from '../classes/landAsmtDataTemp';
import * as moment from 'moment';
import { getBrgySubd } from '../services/getBrgySubd.service';

var ownerLs: landOwner[] = []
var adminLs: adminOwner[] = []
var stripInf: stripInfo[] = []
var imprInf: improvementInfo[] = []
var mrktVal: marketValue[] = [];
// var adjustmentFactors: any = {
//   roadType: [ 0, -3, -6, -9 ],
//   distAllWeather: [ 0, -2, -4, -6, -8 ],
//   distLocTradeCnt: [ 5, 0, -2, -4, -6 ]
// };


@Component({
  selector: 'app-land-assessment',
  templateUrl: './land-assessment.component.html',
  styleUrls: ['./land-assessment.component.scss'],
})
export class LandAssessmentComponent implements OnInit {


  ///////////////Variable declarations////////////////////
  public lndAsmt: any;
  public ownersLs = new MatTableDataSource(ownerLs)
  public adminsLs = new MatTableDataSource(adminLs)
  public stripSetInfo = new MatTableDataSource(stripInf)
  public impInf = new MatTableDataSource(imprInf)
  public marketValue = new MatTableDataSource(mrktVal)
  public ownerHeader: string[] = ['fname', 'mname', 'lname', 'address', 'contact', 'tin', 'actions'];
  public adminHeader: string[] = ['fname', 'mname', 'lname', 'address', 'contact', 'tin', 'actions'];
  public stripHeader: string[] = ['stripno', 'striparea', 'adjustment', 'adbaserate', 'stripmval', 'actions'];
  public impHeader: string[] = ['kind', 'total', 'unitval', 'baseval', 'actions'];
  public mValHeader: string[] = ['bmval', 'adjfactor', 'adjperc', 'adjval', 'markval', 'actions'];
  public adjustmentFactorSel: any = {
    road: [
      { factor: 'PROVINCIAL OR NATIONAL ROAD', value: '0' },
      { factor: 'ALL WEATHER ROAD', value: '-3' },
      { factor: 'ALONG DIRT ROAD', value: '-6' },
      { factor: 'NO ROAD OUTLET', value: '-9' }
    ],
    distRoad: [
      { factor: '0-1', type:'road', value: '0' },
      { factor: '1-3', type:'road', value: '-2' },
      { factor: '3-6', type:'road', value: '-4' },
      { factor: '6-9', type:'road', value: '-6' },
      { factor: '9-ABOVE', type:'road', value: '-8' }
    ],
    distTrade: [
      { factor: '0-1', type: 'trade', value: '5' },
      { factor: '1-3', type: 'trade', value: '0' },
      { factor: '3-6', type: 'trade', value: '-2' },
      { factor: '6-9', type: 'trade', value: '-4' },
      { factor: '9-ABOVE', type: 'trade', value: '-6' }
    ]
  }
  public quarter: selectOpt[] = [
    { value: '1', viewVal: '1' },
    { value: '2', viewVal: '2' },
    { value: '3', viewVal: '3' },
    { value: '4', viewVal: '4' }
  ];
  public trnsLs: selectOpt[] = [
    { value: 'DISCOVERY / NEW DECLARATION (DC)', viewVal: 'DISCOVERY / NEW DECLARATION (DC)' },
    { value: 'SUBDIVISION (SD)', viewVal: 'SUBDIVISION (SD)' },
    { value: 'CONSOLIDATION (CS)', viewVal: 'CONSOLIDATION (CS)' },
    { value: 'PHYSICAL CHANGE (PC)', viewVal: 'PHYSICAL CHANGE (PC)' },
    { value: 'DISPUTE IN ASSESSED VALUE (DP)', viewVal: 'DISPUTE IN ASSESSED VALUE (DP)' },
    { value: 'TRANSFER (TR)', viewVal: 'TRANSFER (TR)' },
    { value: 'SEGREGATION (SG)', viewVal: 'SEGREGATION (SG)' },
    { value: 'RECLASSIFICATION (RC)', viewVal: 'RECLASSIFICATION (RC)' },
    { value: 'SPECIAL PROJECT (SP)', viewVal: 'SPECIAL PROJECT (SP)' },
  ];
  public landClassLs: any = [];
  public subClassLs: selectOpt[] = [];
  public stripNm: selectOpt[] = [];
  public status: selectOpt[] = [
    { value: 'TAXABLE', viewVal: 'TAXABLE' },
    { value: 'EXEMPTED', viewVal: 'EXEMPTED' }
  ];
  public actualUse: selectOpt[] = [
    { value: 'COMMERCIAL', viewVal: 'COMMERCIAL' },
    { value: 'INDUSTRIAL', viewVal: 'INDUSTRIAL' },
    { value: 'RESIDENTIAL', viewVal: 'RESIDENTIAL' },
    { value: 'AGRICULTURAL', viewVal: 'AGRICULTURAL' }
  ];
  public brgySubdLs: any;
	public lsBrgy: selectOpt[] = [];
	public lsSubd: selectOpt[] = [
		{ value: 'NONE', viewVal: 'NONE' }
	];
  private stripEnabled: boolean = false;
  private InteriorEnabled: boolean = false;
  private cornerEnabled: boolean = false;
  public username: string = '';
  ////////UI variables//////////////////////////////////
  public isVisible_spinner: boolean = false;
  public pinspinner: boolean = true;
  public checkpinresult: string;
  public enableStripping: boolean = false;


  ////////////class constructor////////////////////////
  constructor(
    private chckpin: pincheck,
    private matDialog: MatDialog,
    private gLndFaas: genFaas,
    private getMrktVal: getMarketValues,
    private asmtLand: assessLand,
    private gPosHolder: getPosHolders,
    private lsBrgySubd: getBrgySubd,
    private route: ActivatedRoute
  ) { }

  /////////////Init component///////////////////////////
  ngOnInit() {
    if(!localStorage.getItem('auth')) {
      window.location.href = '/';
    } else {
      this.username = this.route.snapshot.paramMap.get('username');
      this.initForm();
      this.getMrktVal.getValues().subscribe(res => {
        this.landClassLs = res;
        this.lndAppChngVal(this.lndAsmt.landAppraisal);
      });
      this.gPosHolder.getPosHoldersCl("FAAS").subscribe(res => {
        this.lndAsmt.propAsmt.approvedName = res[0].holder_name;
      });
      this.lsBrgySubd.get().subscribe(res => {
        this.brgySubdLs = res.res;
        let brgys = Array.from(new Set(res.res.map(x => x.barangay_name)));
        _.forEach(brgys, (arr: string) => {
          this.lsBrgy.push({
            value: arr,
            viewVal: arr
          })
        })
      })
      this.checkpinresult = '';
      ownerLs = [];
      adminLs = [];
      imprInf = [];
      mrktVal = [];
      this.ownersLs = new MatTableDataSource(ownerLs);
      this.adminsLs = new MatTableDataSource(adminLs);
      this.impInf = new MatTableDataSource(imprInf);
      this.marketValue = new MatTableDataSource(mrktVal);
      this.setAsmtLvl(this.lndAsmt.propAsmt)
    }
  }

  ///////////////////////////////Event handlers//////////////////////////////////////////////
  //handles changes on transaction code
  selectTrnsCode(obj: any) {
    if(obj == 'PHYSICAL CHANGE (PC)' ||
      obj == 'DISPUTE IN ASSESSED VALUE (DP)' ||
      obj == 'TRANSFER (TR)' ||
      obj == 'RECLASSIFICATION (RC)' ||
      obj == 'SPECIAL PROJECT (SP)') {
        const md = this.matDialog.open(LndAsmtSearch, { disableClose: true, data: { tCode: obj}, width: '90%', height: '90%', panelClass: 'custom-dialog-container' });
        md.afterClosed().subscribe(res => {
          if(res == undefined) {
            this.lndAsmt.trnsCode = 'DISCOVERY/NEW DECLARATION (DC)'
          } else {
            this.populateForm(res, obj);
          }
        })
    } else if (obj == 'SUBDIVISION (SD)' ||
			obj == 'CONSOLIDATION (CS)' ||
			obj == 'SEGREGATION (SG)'){
        const md = this.matDialog.open(LndAsmtPending, { disableClose: true, width: '90%', height: '90%', data: { tCode: obj }, panelClass: 'custom-dialog-container' });
        md.afterClosed().subscribe(res => {
          if(res == undefined) {
            this.lndAsmt.trnsCode = 'DISCOVERY/NEW DECLARATION (DC)'
          } else {

          }
        })
    }
  }

  //sets district code and lists of subdivisions
  setDistCodeSubd() {
    this.lsSubd = [
      { value: 'NONE', viewVal: 'NONE'}
    ];
    let brgy = this.lndAsmt.propLoc.barangay,
      obj = _.find(this.brgySubdLs, { barangay_name: brgy });
    this.lndAsmt.pin.district = (obj.district_code.length == 2) ? obj.district_code : '0' + obj.district_code;
    this.lndAsmt.pin.barangay = (obj.barangay_code.length == 2) ? '0' + obj.barangay_code : '00' + obj.barangay_code;
    _.forEach(this.brgySubdLs, arr => {
      if(arr.barangay_name == brgy) {
        if(arr.subdivision_name != null) {
          this.lsSubd.push({
            value: arr.subdivision_name,
						viewVal: arr.subdivision_name
          })
        }
      }
    })
  }

  //sets class and subclass in land appraisal
  setClsSubCls() {
    let brgy = this.lndAsmt.propLoc.barangay,
      subdVal = this.lndAsmt.propLoc.subdivision,
      obj = _.find(this.brgySubdLs, { barangay_name: brgy, subdivision_name: subdVal });
    if(subdVal != 'NONE') {
      this.lndAsmt.landAppraisal.class = 'RESIDENTIAL'
      this.lndAsmt.landAppraisal.subCls = obj.sub_class;
      this.lndAsmt.propAsmt.actualUse = 'RESIDENTIAL'
    } else {
      this.lndAsmt.landAppraisal.class = 'COMMERCIAL';
      this.lndAsmt.landAppraisal.subCls = 'C-1';
      this.lndAsmt.propAsmt.actualUse = 'COMMERCIAL';
    }
    this.lndAppChngVal(this.lndAsmt.landAppraisal);
    this.lnAppSubCUV(this.lndAsmt.landAppraisal);
    this.setAsmtLvl(this.lndAsmt.propAsmt);
  }

  //pin availability check
  checkPIN(evt: MouseEvent, obj: any) {
    evt.defaultPrevented;
    this.pinspinner = false;
    let pin = obj.city + '-' + obj.district + '-' + obj.barangay + '-' + obj.section + '-' + obj.parcel;
    console.log(pin);
    this.chckpin.checkPin({ pin: pin }).subscribe(res => {
      (res.success) ? this.checkpinresult = 'check' : this.checkpinresult = 'close';
      this.isVisible_spinner = false;
      this.pinspinner = true;
    });
  }

  //add owner
  addOwner(obj: any) {
    ownerLs.push({
      ownFName: obj.ownFName,
			ownMName: obj.ownMName,
			ownLName: obj.ownLName,
      ownAddress: obj.ownAddress,
      ownContact: obj.ownContact,
      ownTIN: obj.ownTIN
    });
    this.ownersLs = new MatTableDataSource(ownerLs);
    Object.keys(obj).forEach(key => {
      obj[key] = '';
    })
  }

  //remove owner
  removeOwnerDetail(obj: any) {
    let ind = _.findIndex(ownerLs, obj);
    _.pull(ownerLs, obj);
    this.ownersLs = new MatTableDataSource(ownerLs);
  }

  //add admin / beneficial user
  addAdmin(obj: any) {
    adminLs.push({
      admFName: obj.admFName,
      admMName: obj.admMName,
      admLName: obj.admLName,
      admAddress: obj.admAddress,
      admContact: obj.admContact,
      admTIN: obj.admTIN,
    });
    this.adminsLs = new MatTableDataSource(adminLs);
    Object.keys(obj).forEach(key => {
      obj[key] = '';
    });
  }

  //remove admin
  removeAdminDetail(obj: any) {
    let ind = _.findIndex(adminLs, obj);
    _.pull(adminLs, obj);
    this.adminsLs = new MatTableDataSource(adminLs);
  }

  //change subclass options
  lndAppChngVal(obj: any) {
    this.subClassLs = [];
    _.forEach(this.landClassLs, arr => {
      if(arr.class == obj.class) {
        this.subClassLs.push({
          value: arr.sub_class,
          viewVal: arr.sub_class
        });
      }
    });
    obj.subCls = this.subClassLs[0].value;
    this.lnAppSubCUV(this.lndAsmt.landAppraisal);
  }

  //change unit market value
  lnAppSubCUV(obj: any) {

    _.forEach(this.landClassLs, arr => {
      if(arr.class == obj.class) {
        if(arr.sub_class == obj.subCls) {
          obj.unitVal = arr.unit_market_value;
        }
      }
    });
    this.computeBMV(this.lndAsmt.landAppraisal);
  }

  //compute for basic market value based on class and sub class changes
  computeBMV(obj: any) {

    if(obj.stripping && !obj.cornerLot && !obj.interiorLot) {
      this.lndAsmt.landAppraisal.baseMarketVal = '0.0000';
    } else if(obj.stripping && !obj.cornerLot && obj.interiorLot) {
      this.lndAsmt.landAppraisal.baseMarketVal = (((+obj.area * +obj.unitVal) / 2).toFixed(4)).toString()
    } else if(obj.stripping && obj.cornerLot && !obj.interiorLot) {
      this.lndAsmt.landAppraisal.baseMarketVal = '0.0000';
    } else {
      this.lndAsmt.landAppraisal.baseMarketVal = ((+obj.area * +obj.unitVal).toFixed(4)).toString();
    }
    this.setStrip(this.lndAsmt.landAppraisal)
    this.lndAsmt.marketVal.mBaseVal = obj.baseMarketVal
    this.lndAsmt.propAsmt.marketVal = obj.baseMarketVal
    this.compAssessedVal(this.lndAsmt.propAsmt);
  }

  //interior lot toggle
  interiorToggle(obj: any) {
    this.InteriorEnabled = !this.InteriorEnabled;
    (this.InteriorEnabled) ? obj.stripping = true : obj.stripping = false
    this.computeBMV(obj);
    this.setInteriorLot(obj)
  }

  //interior lot function
  setInteriorLot(obj: any) {
    if(this.InteriorEnabled) {
      stripInf = [];
      let unitVl = ((+obj.unitVal * 0.5).toFixed(4)).toString();
      let bmv = ((+unitVl * +obj.area).toFixed(4)).toString();
      stripInf.push({
        stripNum: '1',
        stripArea: obj.area,
        adjustment: '-50',
        adjustedBaseRate: unitVl,
        stripMarkVal: bmv,
      })
      this.stripSetInfo = new MatTableDataSource(stripInf)
    }
  }

  //corner lot toggle
  cornerLotToggle(obj: any) {
    this.cornerEnabled = !this.cornerEnabled;
    this.enableStripping = !this.enableStripping;
    (this.cornerEnabled) ? obj.stripping = true : obj.stripping = false
    this.computeBMV(obj);
    this.setCornerLot(obj)
  }

  //conrner lot function
  setCornerLot(obj: any) {
    if(obj.cornerLot) {
      stripInf = [];
      this.stripNm = [];
      for(let i = 0; i < 3; i++) {
        let x = i + 1;
        let adj = '30'
        if(x == 3) {
          adj = '0'
        }
        stripInf.push({
          stripNum: x.toString(),
          stripArea: '0',
          adjustment: adj.toString(),
          adjustedBaseRate: ((0).toFixed(4)).toString(),
          stripMarkVal: ((0).toFixed(4)).toString(),
        })
        this.stripNm.push({
          value: x.toString(),
          viewVal: x.toString()
        })
      }
      this.lndAsmt.landAppraisal.stripCount = '3';
      this.stripSetInfo = new MatTableDataSource(stripInf)
    }
  }

  //improvement
  addImp(obj: any) {

  }

  //sets the adjustment percentage on choosing adjustment factors
  setAdjPrc(obj: any) {
    let val: any;
    if(obj.mAdjustFactor == 'PROVINCIAL OR NATIONAL ROAD' ||
        obj.mAdjustFactor == 'ALL WEATHER ROAD' ||
        obj.mAdjustFactor == 'ALONG DIRT ROAD' ||
        obj.mAdjustFactor == 'NO ROAD OUTLET') {
      val = _.find(this.adjustmentFactorSel.road, { factor: obj.mAdjustFactor })
      obj.mAdjustPercentage = val.value
    } else {
      let opt = obj.mAdjustFactor.split(' ');
      switch(opt[1]) {
        case 'road':
          val = _.find(this.adjustmentFactorSel.distRoad, { factor: opt[0] });
          obj.mAdjustPercentage = val.value;
          break;
        case 'trade':
          val = _.find(this.adjustmentFactorSel.distTrade, { factor: opt[0] });
          obj.mAdjustPercentage = val.value;
          break;
      }
    }
    obj.mAdjustValue = ((parseFloat(obj.mBaseVal) * (parseFloat(obj.mAdjustPercentage) / 100)).toFixed(4)).toString();
    obj.mMarketVal = ((parseFloat(obj.mBaseVal) + parseFloat(obj.mAdjustValue)).toFixed(4)).toString();
  }

  //compute for adjustment factors
  computeMVAdj(obj: any) {
    console.log(obj);
    //x * ((y + 100) / 100)
    //test equation: BMV - (BMV * ((adjPrc + 100) / 100))
    let adjFc = '';

    if(obj.mAdjustFactor == 'PROVINCIAL OR NATIONAL ROAD' ||
        obj.mAdjustFactor == 'ALL WEATHER ROAD' ||
        obj.mAdjustFactor == 'ALONG DIRT ROAD' ||
        obj.mAdjustFactor == 'NO ROAD OUTLET') {
          adjFc = obj.mAdjustFactor;
    } else {
      let opt = obj.mAdjustFactor.split(' ');
      switch(opt[1]) {
        case 'road':
          adjFc = 'DISTANCE TO ALL WEATHER ROAD: ' + opt[0];
          break;
        case 'trade':
          adjFc = 'DISTANCE TO TRADING CENTER: ' + opt[0];
          break;
      }
    }
    mrktVal.push({
      mBaseVal: obj.mBaseVal,
      mAdjustFactor: adjFc,
      mAdjustPercentage: obj.mAdjustPercentage,
      mAdjustValue: obj.mAdjustValue,
      mMarketVal: obj.mMarketVal,
    })
    this.marketValue = new MatTableDataSource(mrktVal);
    let adj = 0;
    _.forEach(mrktVal, arr => {
      adj = adj + parseFloat(arr.mAdjustValue);
    })
    obj.mvSubTotal = ((parseFloat(obj.mBaseVal) + adj).toFixed(4)).toString()
    this.lndAsmt.propAsmt.marketVal = obj.mvSubTotal
    this.compAssessedVal(this.lndAsmt.propAsmt)
  }

  //removes market value adjustments from the list
  removeMVal(row: any) {
    console.log(row);
    let ind = _.findIndex(mrktVal, row);
    this.lndAsmt.marketVal.mvSubTotal = ((parseFloat(this.lndAsmt.marketVal.mvSubTotal) - (parseFloat(mrktVal[ind].mAdjustValue))).toFixed(4)).toString()
    _.pull(mrktVal, row);
    this.marketValue = new MatTableDataSource(mrktVal);
    this.lndAsmt.propAsmt.marketVal = this.lndAsmt.marketVal.mvSubTotal
    this.compAssessedVal(this.lndAsmt.propAsmt)
  }

  //set strip data on strip table
  setStrip(obj: any) {
    if(this.enableStripping) {
      this.setStripNumSel(obj);
      this.compAssessedVal(this.lndAsmt.propAsmt)
    } else {
      stripInf = [];
      stripInf.push({
        stripNum: '1',
        stripArea: obj.area,
        adjustment: '0',
        adjustedBaseRate: obj.unitVal,
        stripMarkVal: obj.baseMarketVal,
      });
      this.stripSetInfo = new MatTableDataSource(stripInf);
      obj.stripCount = '1';
      obj.stripCount = '1';
      obj.remLandArea = '0';
      obj.stripArea = '0';
      obj.adjustment = '0';
      obj.stripNo = '1';
    }
  }

  //add strip event handler
  addStrip(obj: any) {

    if(parseFloat(obj.stripArea) > 0) {
      let i: any = _.find(stripInf, { stripNum: obj.stripNo });
      let totalArea = parseFloat(obj.remLandArea);
      let currArea = parseFloat(obj.stripArea);
      if(currArea > totalArea) {
        console.log('Invalid input')
      } else {
        i.stripArea = obj.stripArea;
        let remLnd = totalArea - currArea;
        console.log(totalArea)
        console.log(currArea)
        console.log(remLnd)
        obj.remLandArea = remLnd.toString();
        let adjBRate;
        if(!obj.cornerLot && !obj.interiorLot) {
          i.adjustment = obj.adjustment
          adjBRate = (parseFloat(obj.unitVal) * ((parseFloat(obj.adjustment) + 100) / 100)).toFixed(4)
        } else if(obj.cornerLot) {
          adjBRate = (parseFloat(obj.unitVal) * ((parseFloat(i.adjustment) + 100) / 100)).toFixed(4)
        }
        i.adjustedBaseRate = adjBRate.toString();
        i.stripMarkVal = ((parseFloat(i.stripArea) * parseFloat(i.adjustedBaseRate)).toFixed(4)).toString()
        let ind = _.findIndex(stripInf, { stripNum: obj.stripNo });
        stripInf[ind] = i;
        this.stripSetInfo = new MatTableDataSource(stripInf)
      }
    } else {
      console.log('Invalid input')
    }
    this.compStrip(obj);
  }

  //summates strip market value
  compStrip(obj: any) {
    let total = 0;
    _.forEach(stripInf, arr => {
      total = total + parseFloat(arr.stripMarkVal)
    });
    obj.baseMarketVal = (total.toFixed(4)).toString();
    this.lndAsmt.propAsmt.marketVal = obj.baseMarketVal;
    this.lndAsmt.marketVal.mBaseVal = obj.baseMarketVal
    this.compAssessedVal(this.lndAsmt.propAsmt);
  }

  //removes strip data
  removeStripDetail(row: any, obj: any) {
    obj.baseMarketVal = (parseFloat(obj.baseMarketVal) - parseFloat(row.stripMarkVal)).toString();
    obj.remLandArea = (parseFloat(obj.remLandArea) + parseFloat(row.stripArea)).toString();
    let ind = _.findIndex(stripInf, { stripNum: row.stripNum });
    stripInf.splice(ind, 1, {
      stripNum: row.stripNum,
      stripArea: '0',
      adjustment: '0',
      adjustedBaseRate: '0',
      stripMarkVal: '0'
    });
    this.stripSetInfo = new MatTableDataSource(stripInf);
  }

  //toggler for strip fields
  stripToggle(obj: any) {
    this.enableStripping = !this.enableStripping;
    // (this.enableStripping) ? obj.baseMarketVal = '0' :
    this.computeBMV(obj);
    this.setStrip(obj);
  }

  //sets strip counts on options
  setStripNumSel(obj: any) {
    stripInf = [];
    this.stripNm = [];
    for(let i = 1 ; i <= +obj.stripCount; i++) {
      this.stripNm.push({
        value: i.toString(),
        viewVal: i.toString()
      });
      stripInf.push({
        stripNum: i.toString(),
        stripArea: '0',
        adjustment: '0',
        adjustedBaseRate: '0',
        stripMarkVal: '0'
      });
    }
    obj.remLandArea = obj.area;
    this.stripSetInfo = new MatTableDataSource(stripInf);
  }

  //sets the assessment level
  setAsmtLvl(obj: any) {
    switch(obj.actualUse) {
      case 'RESIDENTIAL':
				obj.assessmentLvl = '15';
				break;
			case 'AGRICULTURAL':
				obj.assessmentLvl = '40';
				break;
			case 'COMMERCIAL':
				obj.assessmentLvl = '40';
				break;
			case 'INDUSTRIAL':
				obj.assessmentLvl = '40';
				break;
    }
    this.compAssessedVal(obj)
  }

  //computes for assessed value
  compAssessedVal(obj: any) {
    let asmtVal = Math.ceil(parseFloat(obj.marketVal) * (parseFloat(obj.assessmentLvl) / 100) / 10) * 10;
    obj.assessedVal = (asmtVal.toFixed(4)).toString();
    obj.total = (asmtVal.toFixed(4)).toString();
  }

  //save data
  save(evt: MouseEvent, form: any) {
    evt.defaultPrevented;
    let data: landAsmtDataTemp = {
      trnsCode: form.trnsCode,
			arpNo: form.arpNo,
			pin: {
				city: form.pin.city,
				district: form.pin.district,
				barangay: form.pin.barangay,
				section: form.pin.section,
				parcel: form.pin.parcel,
			},
			OCT_TCT: form.OCT_TCT,
			surveyNo: form.surveyNo,
			lotNo: form.lotNo,
			blockNo: form.blockNo,
			propLoc: {
				streetNo: form.propLoc.streetNo,
				brgy: form.propLoc.barangay,
				subd: form.propLoc.subdivision,
				city: form.propLoc.city,
				province: form.propLoc.province,
				north: form.propLoc.north,
				south: form.propLoc.south,
				east: form.propLoc.east,
				west: form.propLoc.west,
			},
			ownerDetails: ownerLs,
			adminDetails: adminLs,
			landAppraisal: {
				class: form.landAppraisal.class,
				subCls: form.landAppraisal.subCls,
				area: form.landAppraisal.area,
				unitVal: form.landAppraisal.unitVal,
				baseMarketVal: form.landAppraisal.baseMarketVal,
				interiorLot: (form.landAppraisal.interiorLot) ? 1 : 0,
				cornerLot: (form.landAppraisal.cornerLot) ? 1 : 0,
				stripping: (form.landAppraisal.stripping) ? 1 : 0,
			},
			stripSet: stripInf,
			othImp: imprInf,
			marketVal: mrktVal,
			propAsmt: {
				actualUse: form.propAsmt.actualUse,
				marketVal: form.propAsmt.marketVal,
				assessmentLvl: form.propAsmt.assessmentLvl,
				assessedVal: form.propAsmt.assessedVal,
				specialClass: (form.propAsmt.specialClass) ? 1 : 0,
				status: form.propAsmt.status,
				efftQ: form.propAsmt.efftQ,
				effty: form.propAsmt.effty,
				total: form.propAsmt.total,
				appraisedName: form.propAsmt.appraisedName,
				appraisedDate: (form.propAsmt.appraisedDate == '') ? '' : moment(form.propertyAssessment.appraisedDate).format('MM/DD/YYYY'),
				recommendName: form.propAsmt.recommendName,
				recommendDate: (form.propAsmt.recommendDate == '') ? '' : moment(form.propertyAssessment.recommendDate).format('MM/DD/YYYY'),
				approvedName: form.propAsmt.approvedName,
				approvedDate: (form.propAsmt.approvedDate == '') ? '' : moment(form.propertyAssessment.approvedDate).format('MM/DD/YYYY'),
				memoranda: form.propAsmt.memoranda,
			},
			supersededRec: {
				supPin: form.supersededRec.supPin,
				supArpNo: form.supersededRec.supArpNo,
				supTDNo: form.supersededRec.supTDNo,
				supTotalAssessedVal: (form.supersededRec.supTotalAssessedVal == '') ? '0.0000' : form.supersededRec.supTotalAssessedVal,
				supPrevOwner: form.supersededRec.supPrevOwner,
				supEff: form.supersededRec.supEff,
				supARPageNo: form.supersededRec.supARPageNo,
				supRecPersonnel: form.supersededRec.supRecPersonnel,
				supDate: (form.supersededRec.supDate == '') ? '' : moment(form.supersededRec.supDate).format('MM/DD/YYYY'),
			},
			status: (form.status == '') ? 'CURRENT' : form.status,
			dateCreated: moment(new Date()).format('MM/DD/YYYY'),
			encoder: this.username,
			attachment: form.attachment,
    }
    console.log(data)
    if(data.trnsCode == 'DISCOVERY / NEW DECLARATION (DC)' ||
      data.trnsCode == 'PHYSICAL CHANGE (PC)' ||
      data.trnsCode == 'DISPUTE IN ASSESSED VALUE (DP)' ||
      data.trnsCode == 'TRANSFER (TR)' ||
      data.trnsCode == 'RECLASSIFICATION (RC)' ||
      data.trnsCode == 'SPECIAL PROJECT (SP)') {
      this.asmtLand.saveLand(data).subscribe(res => {
        if(res.res) {
          this.resetForm();
        }
      })
    } else {
      this.asmtLand.updateLand(data).subscribe(res => {
        console.log(res)
      })
    }
  }

  //resets form
  resetForm() {
    this.ngOnInit();
  }

  ////////////////////////Methods////////////////////////
  //initialize whole form onInit
  initForm() {
    this.lndAsmt = {
      trnsCode: 'DISCOVERY / NEW DECLARATION (DC)',
    	arpNo: '',
    	pin: {
    		city: '130',
    		district: '',
    		barangay: '',
    		section: '',
    		parcel: '',
    	},
    	OCT_TCT: '',
    	surveyNo: '',
    	lotNo: '',
    	blockNo: '',
    	propLoc: {
    		streetNo: '',
    		barangay: '',
    		subdivision: '',
    		city: 'SAN PABLO CITY',
    		province: 'LAGUNA',
    		north: '',
    		south: '',
    		east: '',
    		west: '',
    	},
    	ownerDetails: {
        ownFName: '',
      	ownMName: '',
      	ownLName: '',
        ownAddress: '',
        ownContact: '',
        ownTIN: '',
      },
    	adminDetails: {
        admFName: '',
      	admMName: '',
      	admLName: '',
        admAddress: '',
        admContact: '',
        admTIN: '',
      },
    	landAppraisal: {
    		class: 'COMMERCIAL',
    		subCls: 'C-1',
    		area: '0',
    		unitVal: '',
    		baseMarketVal: '',
    		interiorLot: false,
    		cornerLot: false,
    		stripping: false,
        stripCount: '1',
        remLandArea: '0',
        stripArea: '0',
        adjustment: '0',
        stripNo: '1',
    	},
    	othImp: {
        kind: '',
        totalNo: '',
        unitVal: '',
        basicMarketVal: '',
        subTotal: ''
      },
    	marketVal: {
        mBaseVal: '',
        mAdjustFactor: '',
        mAdjustPercentage: '',
        mAdjustValue: '',
        mMarketVal: '',
        mvSubTotal: ''
      },
    	propAsmt: {
    		actualUse: 'COMMERCIAL',
    		marketVal: '0',
    		assessmentLvl: '',
    		assessedVal: '0',
    		specialClass: false,
    		status: 'TAXABLE',
    		efftQ: '1',
    		effty: '',
    		total: '0',
    		appraisedName: '',
    		appraisedDate: '',
    		recommendName: '',
    		recommendDate: '',
    		approvedName: '',
    		approvedDate: '',
    		memoranda: '',
    	},
    	supersededRec: {
    		supPin: '',
    		supArpNo: '',
    		supTDNo: '',
    		supTotalAssessedVal: '',
    		supPrevOwner: '',
    		supEff: '',
    		supARPageNo: '',
    		supRecPersonnel: '',
    		supDate: '',
    	},
    	status: '',
    	dateCreated: '',
    	encoder: '',
    	attachment: '',
    };
  }

  //populates whole form
  populateForm(id: number, trnsCode: string) {

    let data = {
      id: id
    }
    this.gLndFaas.generateLand(data).subscribe(res => {
      console.log(res);
      let xobj = res.faas;
      let owners = res.owners;
      let admins = res.admins;
      let strips = res.strips;
      let mVal = res.marketval;
      this.lndAsmt = {
        trnsCode: trnsCode,
      	arpNo: xobj.arp_no,
      	pin: {
      		city: xobj.pin_city,
      		district: xobj.pin_district,
      		barangay: xobj.pin_barangay,
      		section: xobj.pin_section,
      		parcel: xobj.pin_parcel,
      	},
      	OCT_TCT: xobj.OCT_TCT_no,
      	surveyNo: xobj.survey_no,
      	lotNo: xobj.lot_no,
      	blockNo: xobj.block_no,
      	propLoc: {
      		streetNo: xobj.street_no,
      		barangay: xobj.barangay,
      		subdivision: xobj.subdivision,
      		city: 'SAN PABLO CITY',
      		province: 'LAGUNA',
      		north: xobj.north,
      		south: xobj.south,
      		east: xobj.east,
      		west: xobj.west,
      	},
      	ownerDetails: {
          ownFName: '',
        	ownMName: '',
        	ownLName: '',
          ownAddress: '',
          ownContact: '',
          ownTIN: '',
        },
      	adminDetails: {
          admFName: '',
        	admMName: '',
        	admLName: '',
          admAddress: '',
          admContact: '',
          admTIN: '',
        },
      	landAppraisal: {
      		class: xobj.class,
      		subCls: '',
      		area: xobj.area,
      		unitVal: xobj.unit_value,
      		baseMarketVal: xobj.base_market_value,
      		interiorLot: xobj.interior_lot,
      		cornerLot: xobj.corner_lot,
      		stripping: xobj.stripping,
          stripCount: '1',
          remLandArea: '0',
          stripArea: '0',
          adjustment: '0',
          stripNo: '1',
      	},
      	othImp: {
          kind: '',
          totalNo: '',
          unitVal: '',
          basicMarketVal: '',
          subTotal: ''
        },
      	marketVal: {
          mBaseVal: '',
          mAdjustFactor: '',
          mAdjustPercentage: '',
          mAdjustValue: '',
          mMarketVal: '',
          subTotal: ''
        },
      	propAsmt: {
      		actualUse: xobj.pa_actual_use,
      		marketVal: xobj.pa_market_value,
      		assessmentLvl: xobj.pa_assessment_level,
      		assessedVal: xobj.pa_assessed_value,
      		specialClass: xobj.pa_special_class,
      		status: xobj.pa_status,
      		efftQ: xobj.pa_effectivity_assess_quarter,
      		effty: xobj.pa_effectivity_assess_year,
      		total: xobj.pa_total_assessed_value,
      		appraisedName: xobj.appraised_by,
      		appraisedDate: new Date(xobj.appraised_by_date),
      		recommendName: xobj.recommending,
      		recommendDate: new Date(xobj.recommending_date),
      		approvedName: xobj.approved_by,
      		approvedDate: new Date(xobj.approved_by_date),
      		memoranda: xobj.memoranda,
      	},
      	supersededRec: {
      		supPin: xobj.superseded_pin,
      		supArpNo: xobj.superseded_arp_no,
      		supTDNo: xobj.superseded_td_no,
      		supTotalAssessedVal: xobj.superseded_total_assessed_value,
      		supPrevOwner: xobj.superseded_previous_owner,
      		supEff: xobj.superseded_effectivity_assess,
      		supARPageNo: xobj.superseded_ar_page_no,
      		supRecPersonnel: xobj.superseded_recording_personnel,
      		supDate: new Date(xobj.superseded_date),
      	},
      	status: xobj.status,
      	dateCreated: xobj.date_created,
      	encoder: xobj.encoder_id,
      	attachment: xobj.attachment_file,
      };
      this.lndAppChngVal(this.lndAsmt.landAppraisal);
      this.lndAsmt.landAppraisal.subCls = xobj.sub_class;
      this.lnAppSubCUV(this.lndAsmt.landAppraisal);
      ownerLs = [];
      adminLs = [];
      stripInf = [];
      imprInf = [];
      mrktVal = [];
      if(owners.length > 0) {
        _.forEach(owners, arr => {
          ownerLs.push({
            ownFName: arr.first_name,
      			ownMName: arr.middle_name,
      			ownLName: arr.last_name,
            ownAddress: arr.address,
            ownContact: arr.contact_no,
            ownTIN: arr.TIN,
          })
        });
      }
      if(admins.length > 0) {
        _.forEach(admins, arr => {
          adminLs.push({
            admFName: arr.first_name,
            admMName: arr.middle_name,
            admLName: arr.last_name,
            admAddress: arr.address,
            admContact: arr.contact_no,
            admTIN: arr.TIN,
          })
        });
      }
      if(strips.length > 0) {
        _.forEach(strips, arr => {
          stripInf.push({
            stripNum: arr.land_strip_no,
            stripArea: arr.area,
            adjustment: arr.adjustment_percentage,
            adjustedBaseRate: arr.adjusted_unit_value,
            stripMarkVal: arr.adjusted_market_value,
          });
        });
      }
      if(mVal.length > 0) {
        _.forEach(mVal, arr => {
          mrktVal.push({
            mBaseVal: arr.base_market_value,
            mAdjustFactor: arr.type,
            mAdjustPercentage: arr.adjustment_percentage,
            mAdjustValue: arr.adjustment_value,
            mMarketVal: arr.market_value,
          })
        })
      }
      this.ownersLs = new MatTableDataSource(ownerLs);
      this.adminsLs = new MatTableDataSource(adminLs);
      this.stripSetInfo = new MatTableDataSource(stripInf);
      this.marketValue = new MatTableDataSource(mrktVal);
    })
  }
}
