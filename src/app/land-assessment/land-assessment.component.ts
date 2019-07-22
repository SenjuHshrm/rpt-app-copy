import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
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

var ownerLs: landOwner[] = []
var adminLs: adminOwner[] = []
var stripInf: stripInfo[] = []
var imprInf: improvementInfo[] = []
var mrktVal: marketValue[] = []

@Component({
  selector: 'app-land-assessment',
  templateUrl: './land-assessment.component.html',
  styleUrls: ['./land-assessment.component.scss']
})
export class LandAssessmentComponent implements OnInit {

  checkpinresult = 'help';

  ownersLs = new MatTableDataSource(ownerLs)
  adminsLs = new MatTableDataSource(adminLs)
  stripSetInfo = new MatTableDataSource(stripInf)
  impInf = new MatTableDataSource(imprInf)
  marketValue = new MatTableDataSource(mrktVal)
  clrMD: boolean;
  saveMD: boolean;
  stripToggleVal = false
	ownAdd: boolean;
  adminAdd: boolean;
  otheImprvmntsAdd: boolean;
  mvAdd: boolean;
  lndApprAdd: boolean;

  stripToggle(grp: any) {
    this.stripToggleVal = !this.stripToggleVal
		this.computeBMV(this.landAssessment.get('landAppraisal'));
    if (this.stripToggleVal) {
      Object.keys(grp.controls).forEach(key => {
        grp.controls[key].enable();
      });
			grp.controls['remLandArea'].setValue(this.landAssessment.get('landAppraisal').get('area').value)
    } else {
      Object.keys(grp.controls).forEach(key => {
				grp.controls[key].reset();
        grp.controls[key].disable();
      });


    }

  }

  ownerHeader: string[] = ['name', 'address', 'contact', 'tin', 'actions']
  adminHeader: string[] = ['name', 'address', 'contact', 'tin', 'actions']
  stripHeader: string[] = ['stripno', 'striparea', 'adjustment', 'adbaserate', 'stripmval']
  impHeader: string[] = ['kind', 'total', 'unitval', 'baseval', 'actions']
  mValHeader: string[] = ['bmval', 'adjfactor', 'adjperc', 'adjval', 'markval', 'actions']

  trnsLs: selectOpt[] = [
    { value: 'DISCOVERY/NEW DECLARATION (DC)', viewVal: 'DISCOVERY/NEW DECLARATION (DC)' },
    { value: 'SUBDIVISION (SD)', viewVal: 'SUBDIVISION (SD)' },
    { value: 'CONSOLIDATION (CS)', viewVal: 'CONSOLIDATION (CS)' },
    { value: 'PHYSICAL CHANGE (PC)', viewVal: 'PHYSICAL CHANGE (PC)' },
    { value: 'DISPUTE IN ASSESSED VALUE (DP)', viewVal: 'DISPUTE IN ASSESSED VALUE (DP)' },
    { value: 'TRANSFER (TR)', viewVal: 'TRANSFER (TR)' },
    { value: 'SEGREGATION (SG)', viewVal: 'SEGREGATION (SG)' },
    { value: 'RECLASSIFICATION (RC)', viewVal: 'RECLASSIFICATION (RC)' },
    { value: 'SPECIAL PROJECT (SP)', viewVal: 'SPECIAL PROJECT (SP)' },
  ]

	landClassLs = [];

  lndAppSubc: number;
  lndAppUnitVal: string = '';
  subClassLs: selectOpt[];
  lndAppBMV: string = '';
  lndAppArea: string;

  actualUse: selectOpt[] = [
    { value: 'COMMERCIAL', viewVal: 'COMMERCIAL' },
    { value: 'INDUSTRIAL', viewVal: 'INDUSTRIAL' },
    { value: 'RESIDENTIAL', viewVal: 'RESIDENTIAL' },
    { value: 'AGRICULTURAL', viewVal: 'AGRICULTURAL' }
  ]

  status: selectOpt[] = [
    { value: 'TAXABLE', viewVal: 'TAXABLE' },
    { value: 'EXEMPTED', viewVal: 'EXEMPTED' }
  ]

  quarter: selectOpt[] = [
    { value: '1', viewVal: '1' },
    { value: '2', viewVal: '2' },
    { value: '3', viewVal: '3' },
    { value: '4', viewVal: '4' }
  ]

  stripNo: selectOpt[]

  public landAssessment: FormGroup;

  constructor(
		private router: Router,
		private chckpin: pincheck,
		private matDialog: MatDialog,
		private gLndFaas: genFaas,
		private getMrktVal: getMarketValues,
		private asmtLand: assessLand,
		private gPosHolder: getPosHolders
	) { }

  ngOnInit() {
    if (!localStorage.getItem('auth')) {
      window.location.href = '/'
    }
    this.resetForm();
		this.getMrktVal.getValues().subscribe(res => {
			_.forEach(res, arr => {
				this.landClassLs.push(arr)
			})
		})
		this.gPosHolder.getPosHoldersCl("FAAS").subscribe(res => {
			this.landAssessment.get('propertyAssessment').get('approvedName').setValue(res[0].holder_name)
		})
  }

  lndAppChngVal(grp: any) {
    let val = grp.controls['class'].value;
		this.subClassLs = [];
		Object.keys(this.landClassLs).forEach(key => {
			if(this.landClassLs[key].class == val) {
				this.subClassLs.push({
					value: this.landClassLs[key].sub_class,
					viewVal: this.landClassLs[key].sub_class
				})
			}
		})
		grp.controls['unitVal'].reset();
    grp.controls['baseMarketVal'].reset();
  }

  isVisible_spinner = false
  pinspinner = true
  checkPIN(grp: any) {
    this.pinspinner = false
    let pin = {
      city: grp.controls['city'].value,
      dist: grp.controls['district'].value,
      brgy: grp.controls['barangay'].value,
      sect: grp.controls['section'].value,
      prcl: grp.controls['parcel'].value
    }
    this.chckpin.checkPin(pin).subscribe(res => {
      (res.success) ? this.checkpinresult = 'check' : this.checkpinresult = 'close';
      this.isVisible_spinner = false
      this.pinspinner = true
    });
  }

	selectTrnsCode(val: any) {
		if(val.value == 'PHYSICAL CHANGE (PC)' ||
				val.value == 'DISPUTE IN ASSESSED VALUE (DP)' ||
				val.value == 'TRANSFER (TR)' ||
				val.value == 'RECLASSIFICATION (RC)' ||
				val.value == 'SPECIAL PROJECT (SP)') {
			const md = this.matDialog.open(LndAsmtSearch, { disableClose: true, data: {tCode: val.value}, width: '90%', height: '90%', panelClass: 'custom-dialog-container' });
			md.afterClosed().subscribe(res => {
				if(res == undefined) {
					// val.value = 'DISCOVERY/NEW DECLARATION';
					this.landAssessment.controls['trnsCode'].setValue('DISCOVERY/NEW DECLARATION');
				} else {
					this.populateForm(res);
				}
			})
		} else if (val.value == 'SUBDIVISION (SD)' ||
								val.value == 'CONSOLIDATION (CS)' ||
								val.value == 'SEGREGATION (SG)') {
			const md = this.matDialog.open(LndAsmtPending, { disableClose: true, width: '90%', height: '90%', data: { tCode: val.value }, panelClass: 'custom-dialog-container' });
			md.afterClosed().subscribe(res => {
				if(res == undefined) {
					this.landAssessment.controls['trnsCode'].setValue('DISCOVERY/NEW DECLARATION (DC)');
				} else {
					this.populateForm(res)
				}
			})
		}
	}

	setAsmtLvl(propAsmt: any) {
		let actlUse = propAsmt.get('actualUse').value,
				asmtLvl = propAsmt.get('assessmentLvl');
		switch(actlUse) {
			case 'RESIDENTIAL':
				asmtLvl.setValue('15');
				break;
			case 'AGRICULTURAL':
				asmtLvl.setValue(40);
				break;
			case 'COMMERCIAL':
				asmtLvl.setValue(40);
				break;
			case 'INDUSTRIAL':
				asmtLvl.setValue(40);
				break;
		}
		this.compAssessedVal(propAsmt)

	}

	compAssessedVal(propAsmt: any) {
		let asmtVal = +this.lndAppBMV * ((+propAsmt.get('assessmentLvl').value) / 100);
		propAsmt.get('assessedVal').setValue(asmtVal);
	}

	populateForm(id: number): void {
		let data = {
			id: id
		}
		this.gLndFaas.generateLand(data).subscribe(res => {
			console.log(res)
			this.initializeForm(res);
		})

	}

  lnAppSubCUV(grp: any) {
    let clss = grp.controls['class'].value,
				subclss = grp.controls['subclass'].value;
		Object.keys(this.landClassLs).forEach(key => {
			if(this.landClassLs[key].class == clss) {
				if(this.landClassLs[key].sub_class == subclss) {
					this.lndAppUnitVal = this.landClassLs[key].unit_market_value
				}
			}
		})
		this.computeBMV(grp);
  }

	stripUpdated: boolean;

  computeBMV(grp: any) {
    (grp.controls['area'].value == null || grp.controls['area'].value == '') ? this.lndAppArea = '0' : this.lndAppArea = grp.controls['area'].value;
    let area: number = parseFloat(this.lndAppArea);
    let unitVl: number = parseFloat(this.lndAppUnitVal);
    this.lndAppBMV = (area * unitVl).toString();
		this.stripNo = [];

    for(let i = 1; i <= (+this.landAssessment.get('stripSet').get('stripCount').value); i++) {
			this.stripNo.push({ value: i.toString(), viewVal: i.toString() })
		}
		let strpSet = this.landAssessment.get('stripSet');
		strpSet.get('adjustment').setValue('0');
		let adjustedBaseRate = parseFloat(this.lndAppUnitVal) * (1 + (+strpSet.get('adjustment').value / 100));
		let stripMarkVal = adjustedBaseRate * parseFloat(grp.controls['area'].value);
		strpSet.get('stripCount').setValue('1');
		strpSet.get('stripNo').setValue('1');
		if(!this.stripToggleVal) {
			stripInf = [];
			stripInf.push({
				stripNum: strpSet.get('stripNo').value,
	      stripArea: grp.controls['area'].value,
	      adjustment: strpSet.get('adjustment').value,
	      adjustedBaseRate: adjustedBaseRate.toString(),
	      stripMarkVal: (stripMarkVal.toString() == 'NaN') ? '0' : stripMarkVal.toString()
			})
			this.stripSetInfo = new MatTableDataSource(stripInf)
			this.lndAppBMV = (area * unitVl).toString()
		} else {
			this.lndAppBMV = '0'
			this.landAssessment.get('stripSet').get('remLandArea').setValue(grp.controls['area'].value);
			this.landAssessment.get('stripSet').get('stripArea').setValue('')
			let stripObj = _.find(stripInf, { stripNum: '1' });
			stripObj.stripNum = '1'
			stripObj.stripArea = '0'
			stripObj.adjustment = '0'
			stripObj.adjustedBaseRate = '0'
			stripObj.stripMarkVal = '0'
			stripInf = [];
			stripInf.push(stripObj)
			this.stripSetInfo = new MatTableDataSource(stripInf);
		}
		let prpAsmtVal = parseFloat(this.lndAppBMV) * (parseFloat(this.landAssessment.get('propertyAssessment').get('assessmentLvl').value) / 100)
		this.landAssessment.get('propertyAssessment').get('assessedVal').setValue(prpAsmtVal.toString())

  }

  save(form: any) {
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
				streetNo: form.propertyLocation.streetNo,
				brgy: form.propertyLocation.barangay,
				subd: form.propertyLocation.subdivision,
				city: form.propertyLocation.city,
				province: form.propertyLocation.province,
				north: form.propertyLocation.north,
				south: form.propertyLocation.south,
				east: form.propertyLocation.east,
				west: form.propertyLocation.west,
			},
			ownerDetails: this.getOwners(),
			adminDetails: this.getAdmins(),
			landAppraisal: {
				class: form.landAppraisal.class,
				subCls: form.landAppraisal.subclass,
				area: form.landAppraisal.area,
				unitVal: form.landAppraisal.unitVal,
				baseMarketVal: form.landAppraisal.baseMarketVal,
				interiorLot: form.landAppraisal.interiorLot,
				cornerLot: form.landAppraisal.cornerLot,
				stripping: form.landAppraisal.stripping,
			},
			stripSet: this.getStrip(),
			othImp: this.getImpr(),
			marketVal: this.getMarketVal(),
			propAsmt: {
				actualUse: form.propertyAssessment.actualUse,
				marketVal: form.propertyAssessment.marketVal,
				assessmentLvl: form.propertyAssessment.assessmentLvl,
				assessedVal: form.propertyAssessment.assessedVal,
				specialClass: form.propertyAssessment.specialClass,
				status: form.propertyAssessment.status,
				efftQ: form.propertyAssessment.efftQ,
				effty: form.propertyAssessment.efftY,
				total: form.propertyAssessment.total,
				appraisedName: form.propertyAssessment.appraisedName,
				appraisedDate: (form.propertyAssessment.appraisedDate == '') ? '' : moment(form.propertyAssessment.appraisedDate).format('MM/DD/YYYY'),
				recommendName: form.propertyAssessment.recommendName,
				recommendDate: (form.propertyAssessment.recommendDate == '') ? '' : moment(form.propertyAssessment.recommendDate).format('MM/DD/YYYY'),
				approvedName: form.propertyAssessment.approvedName,
				approvedDate: (form.propertyAssessment.approvedDate == '') ? '' : moment(form.propertyAssessment.approvedDate).format('MM/DD/YYYY'),
				memoranda: form.propertyAssessment.memoranda,
			},
			supersededRec: {
				supPin: form.supersededRec.supPin,
				supArpNo: form.supersededRec.supArpNo,
				supTDNo: form.supersededRec.supTDNo,
				supTotalAssessedVal: form.supersededRec.supTotalAssessedVal,
				supPrevOwner: form.supersededRec.supPrevOwner,
				supEff: form.supersededRec.supEff,
				supARPageNo: form.supersededRec.supARPageNo,
				supRecPersonnel: form.supersededRec.supRecPersonnel,
				supDate: form.supersededRec.supDate,
			},
			status: '',
			dateCreated: '',
			encoder: '',
			attachment: '',
		};
		if(this.landAssessment.controls['trnsCode'].value == 'DISCOVERY/NEW DECLARATION (DC)' ||
			this.landAssessment.controls['trnsCode'].value == 'PHYSICAL CHANGE (PC)' ||
			this.landAssessment.controls['trnsCode'].value == 'DISPUTE IN ASSESSED VALUE (DP)' ||
			this.landAssessment.controls['trnsCode'].value == 'TRANSFER (TR)' ||
			this.landAssessment.controls['trnsCode'].value == 'RECLASSIFICATION (RC)' ||
			this.landAssessment.controls['trnsCode'].value == 'SPECIAL PROJECT (SP)') {
			this.asmtLand.saveLand(data).subscribe(res => {
				console.log(res);
			})
		} else {
			this.asmtLand.updateLand(data).subscribe(res => {
				console.log(res);
			})
		}
  }

	getOwners(): landOwner[] {
		let data: landOwner[] = [];
		_.forEach(ownerLs, (arr) => {
			data.push({
				ownName: arr.ownName,
			  ownAddress: arr.ownAddress,
			  ownContact: arr.ownContact,
			  ownTIN: arr.ownTIN,
			});
		});
		return data;
	}

	getAdmins(): adminOwner[] {
		let data: adminOwner[] = [];
		_.forEach(adminLs, arr => {
			data.push({
				admName: arr.admName,
			  admAddress: arr.admAddress,
			  admContact: arr.admContact,
			  admTIN: arr.admTIN,
			});
		});
		return data;
	}

	getStrip(): stripInfo[] {
		let data: stripInfo[] = [];
		_.forEach(stripInf, arr => {
			data.push({
				stripNum: arr.stripNum,
			  stripArea: arr.stripArea,
			  adjustment: arr.adjustment,
			  adjustedBaseRate: arr.adjustedBaseRate,
			  stripMarkVal: arr.stripMarkVal,
			});
		});
		return data;
	}

	getImpr(): improvementInfo[] {
		let data: improvementInfo[] = [];
		_.forEach(imprInf, arr => {
			data.push({
				kind: arr.kind,
			  totalNo: arr.totalNo,
			  unitVal: arr.unitVal,
			  baseMarkVal: arr.baseMarkVal,
			});
		});
		return data;
	}

	getMarketVal(): marketValue[] {
		let data: marketValue[] = [];
		_.forEach(mrktVal, arr => {
			data.push({
				mBaseVal: arr.mBaseVal,
			  mAdjustFactor: arr.mAdjustFactor,
			  mAdjustPercentage: arr.mAdjustPercentage,
			  mAdjustValue: arr.mAdjustValue,
			  mMarketVal: arr.mMarketVal,
			});
		});
		return data;
	}

  setStripNumSel(grp: any) {

		stripInf = [];
    this.stripNo = []
    let cnt = +grp.controls['stripCount'].value
    for (let i = 1; i <= cnt; i++) {
      this.stripNo.push({ value: i.toString(), viewVal: i.toString() })
			stripInf.push({
				stripNum: i.toString(),
	      stripArea: '0',
	      adjustment: '0',
	      adjustedBaseRate: '0',
	      stripMarkVal: '0'
			});
    }
		grp.controls['remLandArea'].setValue(this.landAssessment.get('landAppraisal').get('area').value);
		this.stripSetInfo = new MatTableDataSource(stripInf);
  }

  addOwner(grp: any) {
    let ownerData = grp.value
    ownerLs.push({
      ownName: ownerData.ownfName + ' ' + ownerData.ownmName + ' ' + ownerData.ownlName,
      ownAddress: ownerData.ownaddress,
      ownContact: ownerData.owncontact,
      ownTIN: ownerData.ownTIN
    })
    this.ownersLs = new MatTableDataSource(ownerLs)
    Object.keys(grp.controls).forEach(key => {
      grp.controls[key].reset()
    })
  }

  addAdmin(grp: any) {
    let adminData = grp.value
    adminLs.push({
      admName: adminData.admfName + ' ' + adminData.admmName + ' ' + adminData.admlName,
      admAddress: adminData.admaddress,
      admContact: adminData.admcontact,
      admTIN: adminData.admTIN
    })
    this.adminsLs = new MatTableDataSource(adminLs)
    Object.keys(grp.controls).forEach(key => {
      grp.controls[key].reset()
    })
  }

  addStrip(grp: any) {
    let stripData = grp.value
		let remLnd: number = 0;
    let adjustedBaseRate: number = 0;
    let stripMarkVal: number = 0;
		let adjPerc = (stripData.adjustment == '0') ? 1 : (parseFloat(stripData.adjustment) / 100)
    if(parseFloat(stripData.remLandArea) <= 0) {
			let obj = _.find(stripInf, { stripNum: stripData.stripNo })
			remLnd = parseFloat(obj.stripArea) - parseFloat(stripData.stripArea);
			adjustedBaseRate = parseFloat(this.lndAppUnitVal) * adjPerc;
			stripMarkVal = adjustedBaseRate * parseFloat(stripData.stripArea);
		} else {
			remLnd = parseFloat(stripData.remLandArea) - parseFloat(stripData.stripArea);
			adjustedBaseRate = parseFloat(this.lndAppUnitVal) * adjPerc;
			stripMarkVal = adjustedBaseRate * parseFloat(stripData.stripArea);
		}
		let ind = _.findIndex(stripInf, { stripNum: stripData.stripNo });
		stripInf.splice(ind, 1, {
			stripNum: stripData.stripNo,
			stripArea: stripData.stripArea,
			adjustment: stripData.adjustment,
			adjustedBaseRate: adjustedBaseRate.toString(),
			stripMarkVal: stripMarkVal.toString()
		})
		grp.controls['remLandArea'].setValue(remLnd.toString());
		this.stripSetInfo = new MatTableDataSource(stripInf)
		this.stripComp();
		this.compAssessedVal(this.landAssessment.get('propertyAssessment'))
  }

  stripComp() {
    let totalMarketVal = 0;
		_.forEach(stripInf, arr => {
			totalMarketVal = totalMarketVal + parseFloat(arr.stripMarkVal)
		})
		this.lndAppBMV = (totalMarketVal).toString();
  }

  addImp(grp: any) {
    let impData = grp.value
    imprInf.push({
      kind: impData.kind,
      totalNo: impData.totalNo,
      unitVal: impData.unitVal,
      baseMarkVal: impData.basicMarketVal
    })
    this.impInf = new MatTableDataSource(imprInf)
    Object.keys(grp.controls).forEach(key => {
      grp.controls[key].reset()
    })
  }

  addMVal(grp: any) {
    let mValue = grp.value
    mrktVal.push({
      mBaseVal: '',
      mAdjustFactor: '',
      mAdjustPercentage: '',
      mAdjustValue: '',
      mMarketVal: ''
    })
    this.marketValue = new MatTableDataSource(mrktVal)
    Object.keys(grp.controls).forEach(key => {
      grp.controls[key].reset()
    })
  }

  removeOwnerDetail(evt: any) {
    _.remove(ownerLs, evt)
    this.ownersLs = new MatTableDataSource(ownerLs)
  }

  removeAdminDetail(evt: any) {
    _.remove(adminLs, evt)
    this.adminsLs = new MatTableDataSource(adminLs)
  }

  removeStripDetail(evt: any) {
    _.remove(stripInf, evt)
    this.stripSetInfo = new MatTableDataSource(stripInf)
  }

  removeImp(evt: any) {
    _.remove(imprInf, evt)
    this.impInf = new MatTableDataSource(imprInf)
  }

  removeMVal(evt: any) {
    _.remove(mrktVal, evt)
    this.marketValue = new MatTableDataSource(mrktVal)
  }

  initializeForm(xobj: any) {
		if(xobj instanceof Object) {
			let data = xobj.faas,
					owners = xobj.owners,
					admins = xobj.admins,
					strips = xobj.strips,
					marketval = xobj.marketval;
			this.landAssessment.controls['arpNo'].setValue(data.arp_no);
			this.landAssessment.controls['pin'].setValue({
				city: data.pin_city,
				district: data.pin_district,
				barangay: data.pin_barangay,
				section: data.pin_section,
				parcel: data.pin_parcel
			});
			this.landAssessment.controls['OCT_TCT'].setValue(data.OCT_TCT_no);
			this.landAssessment.controls['surveyNo'].setValue(data.survey_no);
			this.landAssessment.controls['lotNo'].setValue(data.lot_no);
			this.landAssessment.controls['blockNo'].setValue(data.block_no);
			this.landAssessment.controls['propertyLocation'].setValue({
				streetNo: data.street_no,
				barangay: data.barangay,
				subdivision: data.subdivision,
				city: data.city,
				province: data.province,
				north: data.north,
				south: data.south,
				east: data.east,
				west: data.west
			});
			this.landAssessment.controls['landAppraisal'].setValue({
				class: data.class,
				subclass: data.sub_class,
				area: data.area,
				unitVal: data.unit_value,
				baseMarketVal: data.base_market_value,
				interiorLot: data.interior_lot,
				cornerLot: data.corner_lot,
				stripping: data.stripping
			})
			this.lndAppChngVal(this.landAssessment.get('landAppraisal'));
			this.lnAppSubCUV(this.landAssessment.get('landAppraisal'));
			this.landAssessment.controls['marketVal'].setValue({
				baseMarketVal: data.base_market_value,
				adjustmentFactor: '',
				adjustmentPercent: '',
				adjustmentVal: '',
				marketVal: '',
				mvSubTotal: data.base_market_value
			});
			this.landAssessment.controls['propertyAssessment'].setValue({
				actualUse: data.pa_actual_use,
				marketVal: data.pa_market_value,
				assessmentLvl: data.pa_assessment_level,
				assessedVal: data.pa_assessed_value,
				specialClass: data.pa_special_class,
				status: data.pa_status,
				efftQ: data.pa_effectivity_assess_quarter,
				effty: data.pa_effectivity_assess_year,
				total: data.pa_total_assessed_value,
				appraisedName: data.appraised_by,
				appraisedDate: (data.appraised_by_date == '') ? '' : new Date(data.appraised_by_date),
				recommendName: data.recommending,
				recommendDate: (data.recommending_date == '') ? '' : new Date(data.recommending_date),
				approvedName: data.approved_by,
				approvedDate: (data.approved_by_date == '') ? '' : new Date(data.approved_by_date),
				memoranda: data.memoranda
			})
			this.setAsmtLvl(this.landAssessment.get('propertyAssessment'));
			_.forEach(owners, arr => {
				ownerLs.push({
					ownName: arr.first_name + ' ' + arr.middle_name + ' ' + arr.last_name,
					ownAddress: arr.address,
					ownContact: arr.contact_no,
					ownTIN: arr.TIN
				});
			});
			_.forEach(admins, arr => {
				adminLs.push({
					admName: arr.first_name + ' ' + arr.middle_name + ' ' + arr.last_name,
					admAddress: arr.address,
					admContact: arr.contact_no,
					admTIN: arr.TIN
				});
			});
			_.forEach(strips, arr => {
				stripInf.push({
					stripNum: arr.land_strip_no,
					stripArea: arr.area,
					adjustedBaseRate: arr.adjusted_unit_value,
					adjustment: arr.adjustment_percentage,
					stripMarkVal: arr.adjusted_market_value,
				});
			});
			_.forEach(marketval, arr => {
				mrktVal.push({
					mBaseVal: arr.base_market_value,
					mAdjustValue: arr.adjustment_value,
					mAdjustFactor: arr.type,
					mAdjustPercentage: arr.adjustment_percentage,
					mMarketVal: arr.market_value,
				})
			});
			this.ownersLs = new MatTableDataSource(ownerLs);
		  this.adminsLs = new MatTableDataSource(adminLs);
			this.stripSetInfo = new MatTableDataSource(stripInf);
			this.marketValue = new MatTableDataSource(mrktVal);
		} else {
			this.landAssessment = new FormGroup({
	      trnsCode: new FormControl(''),
	      arpNo: new FormControl(''),
	      pin: new FormGroup({
	        city: new FormControl('', [Validators.required]),
	        district: new FormControl('', [Validators.required]),
	        barangay: new FormControl('', [Validators.required]),
	        section: new FormControl('', [Validators.required]),
	        parcel: new FormControl('', [Validators.required])
	      }),
	      OCT_TCT: new FormControl(''),
	      surveyNo: new FormControl(''),
	      lotNo: new FormControl(''),
	      blockNo: new FormControl(''),
	      propertyLocation: new FormGroup({
	        streetNo: new FormControl(''),
	        barangay: new FormControl(''),
	        subdivision: new FormControl(''),
	        city: new FormControl(''),
	        province: new FormControl(''),
	        north: new FormControl(''),
	        south: new FormControl(''),
	        east: new FormControl(''),
	        west: new FormControl('')
	      }),
	      ownerDetails: new FormGroup({
	        ownfName: new FormControl(''),
	        ownmName: new FormControl(''),
	        ownlName: new FormControl(''),
	        ownaddress: new FormControl(''),
	        owncontact: new FormControl(''),
	        ownTIN: new FormControl(''),
	      }),
	      adminOwnerLs: new FormGroup({
	        admfName: new FormControl(''),
	        admmName: new FormControl(''),
	        admlName: new FormControl(''),
	        admaddress: new FormControl(''),
	        admcontact: new FormControl(''),
	        admTIN: new FormControl(''),
	      }),
	      landAppraisal: new FormGroup({
	        class: new FormControl(''),
	        subclass: new FormControl(''),
	        area: new FormControl(''),
	        unitVal: new FormControl(''),
	        baseMarketVal: new FormControl(''),
	        interiorLot: new FormControl(''),
	        cornerLot: new FormControl(''),
	        stripping: new FormControl('')
	      }),
	      stripSet: new FormGroup({
	        stripCount: new FormControl({ value: '', disabled: true }),
	        remLandArea: new FormControl({ value: '', disabled: true }),
	        stripArea: new FormControl({ value: '', disabled: true }),
	        adjustment: new FormControl({ value: '', disabled: true }),
	        stripNo: new FormControl({ value: '', disabled: true })
	      }),
	      otherImprovements: new FormGroup({
	        kind: new FormControl(''),
	        totalNo: new FormControl(''),
	        unitVal: new FormControl(''),
	        basicMarketVal: new FormControl(''),
	        othImpSubTotal: new FormControl({ value: '', disabled: true })
	      }),
	      marketVal: new FormGroup({
	        baseMarketVal: new FormControl(''),
	        adjustmentFactor: new FormControl(''),
	        adjustmentPercent: new FormControl(''),
	        adjustmentVal: new FormControl(''),
	        marketVal: new FormControl(''),
	        mvSubTotal: new FormControl({ value: '', disabled: true })
	      }),
	      propertyAssessment: new FormGroup({
	        actualUse: new FormControl(''),
	        marketVal: new FormControl('0'),
	        assessmentLvl: new FormControl(''),
	        assessedVal: new FormControl(''),
	        specialClass: new FormControl(''),
	        status: new FormControl(''),
	        efftQ: new FormControl(''),
	        effty: new FormControl(''),
	        total: new FormControl(''),
	        appraisedName: new FormControl(''),
	        appraisedDate: new FormControl(''),
	        recommendName: new FormControl(''),
	        recommendDate: new FormControl(''),
	        approvedName: new FormControl(''),
	        approvedDate: new FormControl(''),
	        memoranda: new FormControl('')
	      }),
	      supersededRec: new FormGroup({
	        supPin: new FormControl(''),
	        supArpNo: new FormControl(''),
	        supTDNo: new FormControl(''),
	        supTotalAssessedVal: new FormControl(''),
	        supPrevOwner: new FormControl(''),
	        supEff: new FormControl(''),
	        supARPageNo: new FormControl(''),
	        supRecPersonnel: new FormControl(''),
	        supDate: new FormControl(''),
	      }),
	      status: new FormControl(''),
	      dateCreated: new FormControl(''),
	      encoder: new FormControl(''),
	      attachment: new FormControl(''),
	    })
			this.landAssessment.controls['trnsCode'].setValue('DISCOVERY/NEW DECLARATION (DC)');
			this.landAssessment.get('propertyAssessment').get('actualUse').setValue('COMMERCIAL');
			this.setAsmtLvl(this.landAssessment.get('propertyAssessment'))
		}

  }

	resetForm() {
		this.initializeForm('');
		ownerLs = [];
		adminLs = [];
		stripInf = [];
		imprInf = [];
		mrktVal = [];
		this.ownersLs = new MatTableDataSource(ownerLs)
	  this.adminsLs = new MatTableDataSource(adminLs)
	  this.stripSetInfo = new MatTableDataSource(stripInf)
	  this.impInf = new MatTableDataSource(imprInf)
	  this.marketValue = new MatTableDataSource(mrktVal)
	}

}
