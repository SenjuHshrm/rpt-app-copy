import { Component, OnInit } from '@angular/core';
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

  stripToggleVal = false

  stripToggle(grp: any) {
    this.stripToggleVal = !this.stripToggleVal
    if (this.stripToggleVal) {
      Object.keys(grp.controls).forEach(key => {
        grp.controls[key].enable();
      });
    } else {
      Object.keys(grp.controls).forEach(key => {
        grp.controls[key].disable();
      });
    }
  }

  ownerHeader: string[] = ['name', 'address', 'contact', 'tin', 'actions']
  adminHeader: string[] = ['name', 'address', 'contact', 'tin', 'actions']
  stripHeader: string[] = ['stripno', 'striparea', 'adjustment', 'adbaserate', 'stripmval', 'actions']
  impHeader: string[] = ['kind', 'total', 'unitval', 'baseval', 'actions']
  mValHeader: string[] = ['bmval', 'adjfactor', 'adjperc', 'adjval', 'markval', 'actions']

  trnsLs: selectOpt[] = [
    { value: 'DISCOVERY/NEW DECLARATION', viewVal: 'DISCOVERY/NEW DECLARATION (DC)' },
    { value: 'SUBDIVISION', viewVal: 'SUBDIVISION (SD)' },
    { value: 'CONSOLIDATION', viewVal: 'CONSOLIDATION (CS)' },
    { value: 'PHYSICAL CHANGE', viewVal: 'PHYSICAL CHANGE (PC)' },
    { value: 'DISPUTE IN ASSESSED VALUE', viewVal: 'DISPUTE IN ASSESSED VALUE (DP)' },
    { value: 'TRANSFER', viewVal: 'TRANSFER (TR)' },
    { value: 'SEGREGATION', viewVal: 'SEGREGATION (SG)' },
    { value: 'RECLASSIFICATIO', viewVal: 'RECLASSIFICATION (RC)' },
    { value: 'SPECIAL PROJECT', viewVal: 'SPECIAL PROJECT (SP)' },
  ]

  landClassLs: any = [
    {
      value: 'COMMERCIAL',
      viewVal: 'COMMERCIAL',
      subC: [
        {
          value: 'C-1',
          viewVal: 'C-1',
          unitVal: '8280.0000'
        },
        {
          value: 'C-2',
          viewVal: 'C-2',
          unitVal: '5260.0000'
        },
        {
          value: 'C-3',
          viewVal: 'C-3',
          unitVal: '3000.0000'
        },
        {
          value: 'C-4',
          viewVal: 'C-4',
          unitVal: '2000.0000'
        }
      ]
    },
    {
      value: 'INDUSTRIAL',
      viewVal: 'INDUSTRIAL',
      subC: [
        {
          value: 'I-1',
          viewVal: 'I-1',
          unitVal: '850.0000'
        },
        {
          value: 'I-2',
          viewVal: 'I-2',
          unitVal: '600.0000'
        },
        {
          value: 'I-3',
          viewVal: 'I-3',
          unitVal: '400.0000'
        },
      ]
    },
    {
      value: 'RESIDENTIAL',
      viewVal: 'RESIDENTIAL',
      subC: [
        {
          value: 'R-1',
          viewVal: 'R-1',
          unitVal: '2860.0000'
        },
        {
          value: 'R-2',
          viewVal: 'R-2',
          unitVal: '1260.0000'
        },
        {
          value: 'R-3',
          viewVal: 'R-3',
          unitVal: '800.0000'
        },
        {
          value: 'R-3 (3-C)',
          viewVal: 'R-3 (3-C)',
          unitVal: '800.0000'
        },
        {
          value: 'R-4',
          viewVal: 'R-4',
          unitVal: '400.0000'
        },
        {
          value: 'R-5-A',
          viewVal: 'R-5-A',
          unitVal: '300.0000'
        },
        {
          value: 'R-5-B',
          viewVal: 'R-5-B',
          unitVal: '200.0000'
        }
      ]
    },
    {
      value: 'AGRICULTURAL',
      viewVal: 'AGRICULTURAL',
      subC: [
        {
          value: 'A-1',
          viewVal: 'A-1',
          unitVal: '17.3300'
        },
        {
          value: 'A-2',
          viewVal: 'A-2',
          unitVal: '15.9460'
        },
        {
          value: 'A-3',
          viewVal: 'A-3',
          unitVal: '12.2490'
        },
        {
          value: 'A-4',
          viewVal: 'A-4',
          unitVal: '9.8220'
        },
        {
          value: 'B-1',
          viewVal: 'B-1',
          unitVal: '16.1620'
        },
        {
          value: 'B-2',
          viewVal: 'B-2',
          unitVal: '14.5460'
        },
        {
          value: 'B-3',
          viewVal: 'B-3',
          unitVal: '11.3130'
        },
        {
          value: 'C-1',
          viewVal: 'C-1',
          unitVal: '24.5330'
        },
        {
          value: 'C-2',
          viewVal: 'C-2',
          unitVal: '21.3350'
        },
        {
          value: 'C-3',
          viewVal: 'C-3',
          unitVal: '13.0840'
        },
        {
          value: 'D-1',
          viewVal: 'D-1',
          unitVal: '17.0000'
        },
        {
          value: 'D-2',
          viewVal: 'D-2',
          unitVal: '15.3000'
        },
        {
          value: 'D-3',
          viewVal: 'D-3',
          unitVal: '13.6000'
        },
        {
          value: 'E-1',
          viewVal: 'E-1',
          unitVal: '9.3330'
        },
        {
          value: 'E-2',
          viewVal: 'E-2',
          unitVal: '7.0000'
        },
        {
          value: 'E-3',
          viewVal: 'E-3',
          unitVal: '4.6670'
        },
      ]
    }
  ]

  lndAppSubc: number;
  lndAppUnitVal: string = '';
  subClassLs: any;
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

  constructor(private router: Router, private chckpin: pincheck) { }

  ngOnInit() {
    if (!localStorage.getItem('auth')) {
      window.location.href = '/'
    }
    this.initializeForm();
  }

  lndAppChngVal(grp: any) {
    let val = grp.controls['class'].value;
    let obj = _.find(this.landClassLs, { 'value': val });
    this.subClassLs = obj.subC;
    grp.controls['area'].reset();
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

  lnAppSubCUV(grp: any) {
    let val = grp.controls['subclass'].value;
    let obj = _.find(this.subClassLs, { 'value': val });
    this.lndAppUnitVal = obj.unitVal;
    this.computeBMV(grp);
  }

  computeBMV(grp: any) {
    (grp.controls['area'].value == null || grp.controls['area'].value == '') ? this.lndAppArea = '0' : this.lndAppArea = grp.controls['area'].value;
    let area: number = parseFloat(this.lndAppArea);
    let unitVl: number = parseFloat(this.lndAppUnitVal);
    this.lndAppBMV = (area * unitVl).toString();
  }

  save(form: object) {
    if (this.landAssessment.valid) {
      console.log(form)
    }
  }

  setStripNumSel(grp: any) {
    this.stripNo = []
    let cnt = +grp.controls['stripCount'].value
    for (let i = 1; i <= cnt; i++) {
      this.stripNo.push({ value: i.toString(), viewVal: i.toString() })
    }
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
    stripInf.push({
      stripNum: stripData.stripNo,
      stripArea: stripData.stripArea,
      adjustment: stripData.adjustment,
      adjustedBaseRate: '',
      stripMarkVal: ''
    })
    this.stripSetInfo = new MatTableDataSource(stripInf)
    Object.keys(grp.controls).forEach(key => {
      if (key != 'stripCount') {
        grp.controls[key].reset()
      }
    })
  }

  stripComp() {

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

  initializeForm() {
    this.landAssessment = new FormGroup({
      trnsCode: new FormControl('', [Validators.required]),
      arpNo: new FormControl('', [Validators.required]),
      pin: new FormGroup({
        city: new FormControl('', [Validators.required]),
        district: new FormControl('', [Validators.required]),
        barangay: new FormControl('', [Validators.required]),
        section: new FormControl('', [Validators.required]),
        parcel: new FormControl('', [Validators.required])
      }),
      OCT_TCT: new FormControl('', [Validators.required]),
      surveyNo: new FormControl('', [Validators.required]),
      lotNo: new FormControl('', [Validators.required]),
      blockNo: new FormControl('', [Validators.required]),
      propertyLocation: new FormGroup({
        streetNo: new FormControl('', [Validators.required]),
        barangay: new FormControl('', [Validators.required]),
        subdivision: new FormControl('', [Validators.required]),
        city: new FormControl('', [Validators.required]),
        province: new FormControl('', [Validators.required]),
        north: new FormControl('', [Validators.required]),
        south: new FormControl('', [Validators.required]),
        east: new FormControl('', [Validators.required]),
        west: new FormControl('', [Validators.required])
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
        marketVal: new FormControl(''),
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
  }

}

export default LandAssessmentComponent
