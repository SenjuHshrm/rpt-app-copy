import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import * as _ from 'lodash';
import { adminOwner } from '../interfaces/adminOwner';


export interface selectOpt {
  value: string;
  viewVal: string;
}

export interface landOwner {
  ownName: string;
  ownAddress: string;
  ownContact: string;
  ownTIN: string;
}

export interface additionalItems {

}

var ownerLs: landOwner[] = []
var adminLs: adminOwner[] = []
var addtnlItems: additionalItems[] = []

@Component({
  selector: 'app-building-reassessment',
  templateUrl: './building-reassessment.component.html',
  styleUrls: ['./building-reassessment.component.scss']
})
export class BuildingReassessmentComponent implements OnInit {
  ownersLs = new MatTableDataSource(ownerLs)
  adminsLs = new MatTableDataSource(adminLs)
  addItemsTable = new MatTableDataSource(addtnlItems)
  mdpdateOccupied;

  bldgOpt: selectOpt[] = [
    { value: 'DISCOVERY/NEW DECLARATION', viewVal: 'DISCOVERY/NEW DECLARATION (DC)' },
    { value: 'SUBDIVISION', viewVal: 'SUBDIVISION (SD)' },
    { value: 'CONSOLIDATION', viewVal: 'CONSOLIDATION (CS)' },
    { value: 'PHYSICAL CHANGE', viewVal: 'PHYSICAL CHANGE (PC)' },
    { value: 'DISPUTE IN ASSESSD VALUE', viewVal: 'DISPUTE IN ASSESSD VALUE (DP)' },
    { value: 'TRANSFER', viewVal: 'TRANSFER (TR)' },
    { value: 'SEGREGATION', viewVal: 'SEGREGATION (SG)' },
    { value: 'RECLASSIFICATIO', viewVal: 'RECLASSIFICATION (RC)' },
    { value: 'SPECIAL PROJECT', viewVal: 'SPECIAL PROJECT (SP)' },
  ]

  //Kind Of Building Options
  kof: selectOpt[] = [
    { value: 'Option 1', viewVal: 'Option 1' },
    { value: 'Option 1', viewVal: 'Option 2' },
    { value: 'Option 1', viewVal: 'Option 3' },
    { value: 'Option 1', viewVal: 'Option 4' },
    { value: 'Option 1', viewVal: 'Option 5' },
  ]

  //Cert of Completion Options
  coc: selectOpt[] = [
    { value: 'Option 1', viewVal: 'Option 1' },
    { value: 'Option 1', viewVal: 'Option 2' },
    { value: 'Option 1', viewVal: 'Option 3' },
    { value: 'Option 1', viewVal: 'Option 4' },
    { value: 'Option 1', viewVal: 'Option 5' },
  ]

  //Structural Type Options
  st: selectOpt[] = [
    { value: 'Option 1', viewVal: 'Option 1' },
    { value: 'Option 1', viewVal: 'Option 2' },
    { value: 'Option 1', viewVal: 'Option 3' },
    { value: 'Option 1', viewVal: 'Option 4' },
    { value: 'Option 1', viewVal: 'Option 5' },
  ]

  //Cert. of Occupancy Options
  occu: selectOpt[] = [
    { value: 'Option 1', viewVal: 'Option 1' },
    { value: 'Option 1', viewVal: 'Option 2' },
    { value: 'Option 1', viewVal: 'Option 3' },
    { value: 'Option 1', viewVal: 'Option 4' },
    { value: 'Option 1', viewVal: 'Option 5' },
  ]

  //Date Constructed/Completed Options
  dcc: selectOpt[] = [
    { value: 'Option 1', viewVal: 'Option 1' },
    { value: 'Option 1', viewVal: 'Option 2' },
    { value: 'Option 1', viewVal: 'Option 3' },
    { value: 'Option 1', viewVal: 'Option 4' },
    { value: 'Option 1', viewVal: 'Option 5' },
  ]

  //Permit Issue Options
  pio: selectOpt[] = [
    { value: 'Option 1', viewVal: 'Option 1' },
    { value: 'Option 1', viewVal: 'Option 2' },
    { value: 'Option 1', viewVal: 'Option 3' },
    { value: 'Option 1', viewVal: 'Option 4' },
    { value: 'Option 1', viewVal: 'Option 5' },
  ]

  //Date Occupied Options
  dteOcc: selectOpt[] = [
    { value: 'Option 1', viewVal: 'Option 1' },
    { value: 'Option 1', viewVal: 'Option 2' },
    { value: 'Option 1', viewVal: 'Option 3' },
    { value: 'Option 1', viewVal: 'Option 4' },
    { value: 'Option 1', viewVal: 'Option 5' },
  ]

  //Building Floors Options
  bflr: selectOpt[] = [
    { value: 'Option 1', viewVal: 'Option 1' },
    { value: 'Option 1', viewVal: 'Option 2' },
    { value: 'Option 1', viewVal: 'Option 3' },
    { value: 'Option 1', viewVal: 'Option 4' },
    { value: 'Option 1', viewVal: 'Option 5' },
  ]

  //Floor Area Options
  flrA: selectOpt[] = [
    { value: 'Option 1', viewVal: 'Option 1' },
    { value: 'Option 1', viewVal: 'Option 2' },
    { value: 'Option 1', viewVal: 'Option 3' },
    { value: 'Option 1', viewVal: 'Option 4' },
    { value: 'Option 1', viewVal: 'Option 5' },
  ]

  //Floor With Same Area Options
  flrArea1: selectOpt[] = [
    { value: 'Option 1', viewVal: 'Option 1' },
    { value: 'Option 1', viewVal: 'Option 2' },
    { value: 'Option 1', viewVal: 'Option 3' },
    { value: 'Option 1', viewVal: 'Option 4' },
    { value: 'Option 1', viewVal: 'Option 5' },
  ]

  flrArea2: selectOpt[] = [
    { value: 'Option 1', viewVal: 'Option 1' },
    { value: 'Option 1', viewVal: 'Option 2' },
    { value: 'Option 1', viewVal: 'Option 3' },
    { value: 'Option 1', viewVal: 'Option 4' },
    { value: 'Option 1', viewVal: 'Option 5' },
  ]

  //flooring -floors w/ same mats
  flrArea3: selectOpt[] = [
    { value: 'Option 1', viewVal: 'Option 1' },
    { value: 'Option 1', viewVal: 'Option 2' },
    { value: 'Option 1', viewVal: 'Option 3' },
    { value: 'Option 1', viewVal: 'Option 4' },
    { value: 'Option 1', viewVal: 'Option 5' },
  ]

  flrArea4: selectOpt[] = [
    { value: 'Option 1', viewVal: 'Option 1' },
    { value: 'Option 1', viewVal: 'Option 2' },
    { value: 'Option 1', viewVal: 'Option 3' },
    { value: 'Option 1', viewVal: 'Option 4' },
    { value: 'Option 1', viewVal: 'Option 5' },
  ]

  flrArea5: selectOpt[] = [
    { value: 'Option 1', viewVal: 'Option 1' },
    { value: 'Option 1', viewVal: 'Option 2' },
    { value: 'Option 1', viewVal: 'Option 3' },
    { value: 'Option 1', viewVal: 'Option 4' },
    { value: 'Option 1', viewVal: 'Option 5' },
  ]

  flrArea6: selectOpt[] = [
    { value: 'Option 1', viewVal: 'Option 1' },
    { value: 'Option 1', viewVal: 'Option 2' },
    { value: 'Option 1', viewVal: 'Option 3' },
    { value: 'Option 1', viewVal: 'Option 4' },
    { value: 'Option 1', viewVal: 'Option 5' },
  ]

  //Materials Options
  matsOpts: selectOpt[] = [
    { value: 'Option 1', viewVal: 'Option 1' },
    { value: 'Option 1', viewVal: 'Option 2' },
    { value: 'Option 1', viewVal: 'Option 3' },
    { value: 'Option 1', viewVal: 'Option 4' },
    { value: 'Option 1', viewVal: 'Option 5' },
  ]

  //structuralDesc Bldg. flrs.
  bldgflrsOpts: selectOpt[] = [
    { value: 'Option 1', viewVal: 'Option 1' },
    { value: 'Option 1', viewVal: 'Option 2' },
    { value: 'Option 1', viewVal: 'Option 3' },
    { value: 'Option 1', viewVal: 'Option 4' },
    { value: 'Option 1', viewVal: 'Option 5' },
  ]

  bldgflrsOpts2: selectOpt[] = [
    { value: 'Option 1', viewVal: 'Option 1' },
    { value: 'Option 1', viewVal: 'Option 2' },
    { value: 'Option 1', viewVal: 'Option 3' },
    { value: 'Option 1', viewVal: 'Option 4' },
    { value: 'Option 1', viewVal: 'Option 5' },
  ]
  //walls and partitions bldg. flrs.

  //structuralDesc Mats
  mats2: selectOpt[] = [
    { value: 'Option 1', viewVal: 'Option 1' },
    { value: 'Option 1', viewVal: 'Option 2' },
    { value: 'Option 1', viewVal: 'Option 3' },
    { value: 'Option 1', viewVal: 'Option 4' },
    { value: 'Option 1', viewVal: 'Option 5' },
  ]

  //walls and partition
  mats3: selectOpt[] = [
    { value: 'Option 1', viewVal: 'Option 1' },
    { value: 'Option 1', viewVal: 'Option 2' },
    { value: 'Option 1', viewVal: 'Option 3' },
    { value: 'Option 1', viewVal: 'Option 4' },
    { value: 'Option 1', viewVal: 'Option 5' },
  ]

  //floortypeOpts
  floortypeOpts: selectOpt[] = [
    { value: 'Option 1', viewVal: 'Option 1' },
    { value: 'Option 1', viewVal: 'Option 2' },
    { value: 'Option 1', viewVal: 'Option 3' },
    { value: 'Option 1', viewVal: 'Option 4' },
    { value: 'Option 1', viewVal: 'Option 5' },
  ]

  //buildingFloors4
  buildingFlrsOpts: selectOpt[] = [
    { value: 'Option 1', viewVal: 'Option 1' },
    { value: 'Option 1', viewVal: 'Option 2' },
    { value: 'Option 1', viewVal: 'Option 3' },
    { value: 'Option 1', viewVal: 'Option 4' },
    { value: 'Option 1', viewVal: 'Option 5' },
  ]

  //additionalItemsOpts
  aItemOpts: selectOpt[] = [
    { value: 'Option 1', viewVal: 'Option 1' },
    { value: 'Option 1', viewVal: 'Option 2' },
    { value: 'Option 1', viewVal: 'Option 3' },
    { value: 'Option 1', viewVal: 'Option 4' },
    { value: 'Option 1', viewVal: 'Option 5' },
  ]

  //subTypeOpts
  stOpts: selectOpt[] = [
    { value: 'Option 1', viewVal: 'Option 1' },
    { value: 'Option 1', viewVal: 'Option 2' },
    { value: 'Option 1', viewVal: 'Option 3' },
    { value: 'Option 1', viewVal: 'Option 4' },
    { value: 'Option 1', viewVal: 'Option 5' },
  ]

  //propertyAppraisal Type of Building Opts
  toBldg: selectOpt[] = [
    { value: 'Option 1', viewVal: 'Option 1' },
    { value: 'Option 1', viewVal: 'Option 2' },
    { value: 'Option 1', viewVal: 'Option 3' },
    { value: 'Option 1', viewVal: 'Option 4' },
    { value: 'Option 1', viewVal: 'Option 5' },
  ]

  //bldgRating Opts
  bRating: selectOpt[] = [
    { value: 'Option 1', viewVal: 'Option 1' },
    { value: 'Option 1', viewVal: 'Option 2' },
    { value: 'Option 1', viewVal: 'Option 3' },
    { value: 'Option 1', viewVal: 'Option 4' },
    { value: 'Option 1', viewVal: 'Option 5' },
  ]

  //propertyAssessment Actual Use Opts
  actualUseOpts: selectOpt[] = [
    { value: 'Option 1', viewVal: 'Option 1' },
    { value: 'Option 1', viewVal: 'Option 2' },
    { value: 'Option 1', viewVal: 'Option 3' },
    { value: 'Option 1', viewVal: 'Option 4' },
    { value: 'Option 1', viewVal: 'Option 5' },
  ]

  //propertyAsmt Status Opts
  statsOpts: selectOpt[] = [
    { value: 'Option 1', viewVal: 'Option 1' },
    { value: 'Option 1', viewVal: 'Option 2' },
    { value: 'Option 1', viewVal: 'Option 3' },
    { value: 'Option 1', viewVal: 'Option 4' },
    { value: 'Option 1', viewVal: 'Option 5' },
  ]

  //Quarter Opts
  qrtrOpts: selectOpt[] = [
    { value: 'Option 1', viewVal: 'Option 1' },
    { value: 'Option 1', viewVal: 'Option 2' },
    { value: 'Option 1', viewVal: 'Option 3' },
    { value: 'Option 1', viewVal: 'Option 4' },
    { value: 'Option 1', viewVal: 'Option 5' },
  ]

  //year Opts
  yrOpts: selectOpt[] = []
  yrOptions() {
    let curYr = new Date().getFullYear();
    for (let i = curYr; i >= 1900; i--) {
      this.yrOpts.push({ value: i.toString(), viewVal: i.toString() })
    }
  }

  public bldgReassessment: FormGroup;

  constructor(private router: Router) { }

  ownerHeader: string[] = ['name', 'address', 'contact', 'tin', 'actions']
  adminHeader: string[] = ['name', 'address', 'contact', 'tin', 'actions']

  //Structural Desc Table
  strDescHeader: string[] = ['Floor No.', 'Area', 'Flooring Material', 'Wall Material', 'Floor Height', 'Standard Height', 'Adjusted Basic Rate', 'Floor Type']
  //Additional Item Table
  aItemHeader: string[] = ['aItm', 'sType', 'sizem2', 'untCost', 'totalC', 'actions']

  ngOnInit() {
    if (!localStorage.getItem('auth')) {
      window.location.href = '/'
    }
    this.bldgReassessment = new FormGroup({
      bldgCode: new FormControl('', [Validators.required]),
      arpNo: new FormControl('', [Validators.required]),

      //PIN
      pin: new FormGroup({
        city: new FormControl('', [Validators.required]),
        district: new FormControl('', [Validators.required]),
        barangay: new FormControl('', [Validators.required]),
        section: new FormControl('', [Validators.required]),
        parcel: new FormControl('', [Validators.required])
      }),

      //ownerDetails
      ownerDetails: new FormGroup({
        ownfName: new FormControl('', [Validators.required]),
        ownmName: new FormControl(''),
        ownlName: new FormControl('', [Validators.required]),
        ownaddress: new FormControl('', [Validators.required]),
        owncontact: new FormControl(''),
        ownTIN: new FormControl(''),
      }),

      //admin
      adminOwnerLs: new FormGroup({
        admfName: new FormControl('', [Validators.required]),
        admmName: new FormControl(''),
        admlName: new FormControl('', [Validators.required]),
        admaddress: new FormControl('', [Validators.required]),
        admcontact: new FormControl(''),
        admTIN: new FormControl(''),
      }),

      //buildingLocation
      buildingLoc: new FormGroup({
        numSt: new FormControl(''),
        bldgLoc: new FormControl(''),
        prov: new FormControl(''),
        brgy: new FormControl(''),
        subd: new FormControl(''),
      }),

      //landReference
      landRef: new FormGroup({
        lndOwnr: new FormControl(''),
        lndcloa: new FormControl(''),
        lndsno: new FormControl(''),
        lndlotno: new FormControl(''),
        lndblkno: new FormControl(''),
        lndarp: new FormControl(''),
        lndarea: new FormControl(''),
      }),

      //generalDescription
      genDescG: new FormGroup({
        genDesc: new FormControl('', [Validators.required]),
        certcom: new FormControl('', [Validators.required]),
        certOcc: new FormControl('', [Validators.required]),
        strType: new FormControl('', [Validators.required]),
        bldgPNo: new FormControl(''),
        dateCC: new FormControl('', [Validators.required]),
        permitIssue: new FormControl('', [Validators.required]),
        dateOccupied: new FormControl('', [Validators.required]),
        cct: new FormControl(''),
        aob: new FormControl('', [Validators.required]),
      }),

      //structuralDescription
      strDescG: new FormGroup({
        numStorey: new FormControl('', [Validators.required]),
        bldgflrs: new FormControl(''),
        flrArea: new FormControl(''),
        chckBoxFlrA: new FormControl(''),
        flr1: new FormControl({ value: '', disabled: true }),
        flr2: new FormControl({ value: '', disabled: true }),
        flr3: new FormControl({ value: '', disabled: true }),
        flr4: new FormControl({ value: '', disabled: true }),
        flr5: new FormControl({ value: '', disabled: true }),
        flr6: new FormControl({ value: '', disabled: true }),
        flr7: new FormControl({ value: '', disabled: true }),
        flr8: new FormControl({ value: '', disabled: true }),
        mats: new FormControl(''),
        materials: new FormControl({ value: '', disabled: true }),
        othrs: new FormControl(''),
        othrs2: new FormControl({ value: '', disabled: true }),
        othrs3: new FormControl({ value: '', disabled: true }),
        othrsCB: new FormControl(''),
        othrsCB2: new FormControl(''),
        othrsCB3: new FormControl(''),
        bldgflrs2: new FormControl(''),
        bldgflrs3: new FormControl(''),
        mats2: new FormControl(''),
        mats3: new FormControl(''),
        flrsameMatsCB: new FormControl(''),
        flrsameMatsCB2: new FormControl(''),
        flrsameMatsCB3: new FormControl(''),

        flrheight: new FormControl(''),
        stndrdheight: new FormControl(''),
        xcessDefHeight: new FormControl(''),

        basicRatePerMeter: new FormControl(''),
        basicRateVal: new FormControl(''),
        aCost: new FormControl(''),

        adjstdBasicRate: new FormControl(''),
        floortype: new FormControl(''),
        buildingFlrs: new FormControl(''),

        totalArea: new FormControl(''),
        totalCost: new FormControl(''),
      }),//structuralDescription END

      //additionalItems
      additionalItems: new FormGroup({
        aItem: new FormControl(''),
        subType: new FormControl(''),
        szem2: new FormControl('', [Validators.required]),
        uCost: new FormControl(''),
        tCost: new FormControl(''),
        aItemTotal: new FormControl(''),
      }),

      //propertyAppraisal
      propertyAppraisal: new FormGroup({
        unPainted: new FormControl(''),
        scndhndMat: new FormControl(''),
        tob: new FormControl('', [Validators.required]),
        bldgRating: new FormControl('', [Validators.required]),
        untConstCost: new FormControl(''),
        subTotal: new FormControl(''),
        CoAiSubTotal: new FormControl(''),
        totalConstCost: new FormControl(''),
        depRate: new FormControl(''),
        totalDep: new FormControl(''),
        depCost: new FormControl(''),
        marketVal: new FormControl(''),
      }),

      //propertyAssessment
      propertyAssessment: new FormGroup({
        actualUse: new FormControl('', [Validators.required]),
        propAsmtMarketVal: new FormControl(''),
        AsmtLevel: new FormControl(''),
        AsmtVal: new FormControl(''),
        spclClass: new FormControl(''),
        status: new FormControl('', [Validators.required]),
        qrtr: new FormControl('', [Validators.required]),
        yr: new FormControl('', [Validators.required]),
        propAsmtTotal: new FormControl(''),
        appraisedBy: new FormControl(''),
        appraisedByDate: new FormControl(''),
        recommending: new FormControl(''),
        recommendingDate: new FormControl(''),
        approvedBy: new FormControl(''),
        approvedByDate: new FormControl(''),
        txtArea: new FormControl('', [Validators.required]),
      }),

      //Record of Superseded Assessment
      rsa: new FormGroup({
        rsaPin: new FormControl(''),
        rsaArp: new FormControl(''),
        rsaTD: new FormControl(''),
        totalAssessVal: new FormControl(''),
        prevOwner: new FormControl(''),
        effectivityAsmt: new FormControl(''),
        recper: new FormControl(''),
        rsaDate: new FormControl(''),
      }),
    })
  }

  removeOwnerDetail(evt: any) {
    _.remove(ownerLs, evt)
    this.ownersLs = new MatTableDataSource(ownerLs)
  }

  //ADD - REMOVE
  addOwner() {
    let ownerformData = this.bldgReassessment.get('ownerDetails').value;
    ownerLs.push({
      ownName: ownerformData.ownfName + ' ' + ownerformData.ownmName + ' ' + ownerformData.ownlName,
      ownAddress: ownerformData.ownaddress,
      ownContact: ownerformData.owncontact,
      ownTIN: ownerformData.ownTIN
    })
    this.ownersLs = new MatTableDataSource(ownerLs)
    Object.keys(this.bldgReassessment.get['ownerDetails'].controls).forEach(key => {
      this.bldgReassessment.get['ownerDetails'].controls[key].reset();
    })
  }

  chckPIN() {
    let pinNum = this.bldgReassessment.get('pin').value;
  }

  addAdmin() {
    let adminData = this.bldgReassessment.get('adminOwnerLs').value;
    adminLs.push({
      admName: adminData.admfName + ' ' + adminData.admmName + ' ' + adminData.admlName,
      admAddress: adminData.admaddress,
      admContact: adminData.admcontact,
      admTIN: adminData.admTIN
    })
    this.adminsLs = new MatTableDataSource(adminLs)
    Object.keys(this.bldgReassessment.get['adminOwnerLs'].controls).forEach(key => {
      this.bldgReassessment.get['adminOwnerLs'].controls[key].reset();
    })
  }

  removeAdminDetail(evt: any) {
    _.remove(adminLs, evt)
    this.adminsLs = new MatTableDataSource(adminLs)
  }

  addAddItems() {
    let aitemsData = this.bldgReassessment.get('additionalItems').value;
    addtnlItems.push({
      adItms: aitemsData.aItem,
      sTyp: aitemsData.subType,
      sizeSqrd: aitemsData.szem2,
      uc: aitemsData.uCost,
      tc: aitemsData.tCost
    })
    this.addItemsTable = new MatTableDataSource(addtnlItems)
    Object.keys(this.bldgReassessment.get['additionalItems'].controls).forEach(key => {
      this.bldgReassessment.get['additionalItems'].controls[key].reset()
    })
  }

  removeAI(evt: any) {
    _.remove(addtnlItems, evt)
    this.addItemsTable = new MatTableDataSource(addtnlItems)
  }

  //CHECKBOX TOGGLE
  ToggleVal = false;
  roofCbToggle = false;
  flrCbToggleOthrs = false;
  flrCbToggleOthrs2 = false;
  flrsmeMatsToggleVal = false;
  flrsmeMatsToggleVal2 = false;
  flrsmeMatsToggleVal3 = false;

  smeAreaToggleBtn() {
    this.ToggleVal = !this.ToggleVal
    if (this.ToggleVal) {
      this.bldgReassessment.get['strDescG'].controls['flr1'].enable()
      this.bldgReassessment.get['strDescG'].controls['flr2'].enable()
    } else {
      this.bldgReassessment.get['strDescG'].controls['flr1'].disable()
      this.bldgReassessment.get['strDescG'].controls['flr2'].disable()
      this.bldgReassessment.get['strDescG'].controls['flr1'].reset()
      this.bldgReassessment.get['strDescG'].controls['flr2'].reset()
    }
  }

  toggleMats() {
    this.roofCbToggle = !this.roofCbToggle
    if (this.roofCbToggle) {
      this.bldgReassessment.get['strDescG'].controls['materials'].enable();
      this.bldgReassessment.get['strDescG'].controls['mats'].disable();
      this.bldgReassessment.get['strDescG'].controls['mats'].reset();
    } else {
      this.bldgReassessment.get['strDescG'].controls['materials'].disable();
      this.bldgReassessment.get['strDescG'].controls['materials'].reset();
      this.bldgReassessment.get['strDescG'].controls['mats'].enable();
    }
  }

  cbtoggle() {
    this.flrCbToggleOthrs = !this.flrCbToggleOthrs
    if (this.flrCbToggleOthrs) {
      this.bldgReassessment.get['strDescG'].controls['othrs2'].enable();
      this.bldgReassessment.get['strDescG'].controls['mats2'].disable();
      this.bldgReassessment.get['strDescG'].controls['mats2'].reset();
    } else {
      this.bldgReassessment.get['strDescG'].controls['othrs2'].disable();
      this.bldgReassessment.get['strDescG'].controls['mats2'].enable();
      this.bldgReassessment.get['strDescG'].controls['othrs2'].reset();
    }
  }

  cbtoggle2() {
    this.flrCbToggleOthrs2 = !this.flrCbToggleOthrs2
    if (this.flrCbToggleOthrs2) {
      this.bldgReassessment.get['strDescG'].controls['othrs3'].enable();
      this.bldgReassessment.get['strDescG'].controls['mats3'].disable();
      this.bldgReassessment.get['strDescG'].controls['mats3'].reset();
    } else {
      this.bldgReassessment.get['strDescG'].controls['othrs3'].disable();
      this.bldgReassessment.get['strDescG'].controls['mats3'].enable();
      this.bldgReassessment.get['strDescG'].controls['othrs3'].reset();
    }
  }

  flrsmeMatsToggle() {
    this.flrsmeMatsToggleVal = !this.flrsmeMatsToggleVal
    if (this.flrsmeMatsToggleVal) {
      this.bldgReassessment.get['strDescG'].controls['flr5'].enable();
      this.bldgReassessment.get['strDescG'].controls['flr6'].enable();
    } else {
      this.bldgReassessment.get['strDescG'].controls['flr5'].disable();
      this.bldgReassessment.get['strDescG'].controls['flr6'].disable();
      this.bldgReassessment.get['strDescG'].controls['flr5'].reset();
      this.bldgReassessment.get['strDescG'].controls['flr6'].reset();
    }
  }

  flrMatsToggle() {
    this.flrsmeMatsToggleVal2 = !this.flrsmeMatsToggleVal2
    if (this.flrsmeMatsToggleVal2) {
      this.bldgReassessment.get['strDescG'].controls['flr3'].enable();
      this.bldgReassessment.get['strDescG'].controls['flr4'].enable();
    } else {
      this.bldgReassessment.get['strDescG'].controls['flr3'].disable();
      this.bldgReassessment.get['strDescG'].controls['flr4'].disable();
      this.bldgReassessment.get['strDescG'].controls['flr3'].reset();
      this.bldgReassessment.get['strDescG'].controls['flr4'].reset();
    }
  }

  flrMatsToggle2() {
    this.flrsmeMatsToggleVal3 = !this.flrsmeMatsToggleVal3
    if (this.flrsmeMatsToggleVal3) {
      this.bldgReassessment.get['strDescG'].controls['flr7'].enable();
      this.bldgReassessment.get['strDescG'].controls['flr8'].enable();
    } else {
      this.bldgReassessment.get['strDescG'].controls['flr7'].disable();
      this.bldgReassessment.get['strDescG'].controls['flr8'].disable();
      this.bldgReassessment.get['strDescG'].controls['flr7'].reset();
      this.bldgReassessment.get['strDescG'].controls['flr8'].reset();
    }
  }
}

export default BuildingReassessmentComponent