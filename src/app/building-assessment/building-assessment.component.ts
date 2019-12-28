import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import * as _ from 'lodash';
import { adminOwner } from '../interfaces/adminOwner';
import { landOwner } from '../interfaces/landOwner';
import { bldgStructDesc} from '../interfaces/bldgStructDesc';
import { GetBldgValues } from '../services/GetBldgValues.service';
import { getBldgAddItems } from '../services/getBldgAddItems.service';
import { selectOpt } from '../interfaces/selectOpt'
import { MatDialog } from '@angular/material/dialog';
import { BldgAsmtLnd } from './dialog-search-land/bldgasmt-search';
import { BldgAsmtBg } from './dialog-search-bldg/bldgasmt-search';
import { getBldgStructMat } from '../services/getBldgStructMat.service';
import { bldgStHeight } from '../services/bldgStHeight.service';
import { group } from '@angular/animations';
import * as moment from 'moment';


export interface additionalItems {

}

var ownerLs: landOwner[] = []
var adminLs: adminOwner[] = []
var addtnlItems: additionalItems[] = []
var strDsc: bldgStructDesc[] = []

@Component({
  selector: 'app-building-assessment',
  templateUrl: './building-assessment.component.html',
  styleUrls: ['./building-assessment.component.scss']
})
export class BuildingAssessmentComponent implements OnInit {

  ////////////////Variable declarations////////
  public bldgAsmt: any;
  public checkpinresult;
  public ownersLs = new MatTableDataSource(ownerLs);
  public adminsLs = new MatTableDataSource(adminLs);

  public bldgOpt: selectOpt[] = [
    { value: 'DISCOVERY/NEW DECLARATION (DC)', viewVal: 'DISCOVERY/NEW DECLARATION (DC)' },
    { value: 'PHYSICAL CHANGE (PC)', viewVal: 'PHYSICAL CHANGE (PC)' },
    { value: 'DISPUTE IN ASSESSED VALUE (DP)', viewVal: 'DISPUTE IN ASSESSD VALUE (DP)' },
		{ value: 'DESTRUCTION OF THE PROPERTY (DT)', viewVal: 'DESTRUCTION OF THE PROPERTY (DT)' },
    { value: 'TRANSFER (TR)', viewVal: 'TRANSFER (TR)' },
    { value: 'RECLASSIFICATION (RC)', viewVal: 'RECLASSIFICATION (RC)' },
    { value: 'SPECIAL PROJECT (SP)', viewVal: 'SPECIAL PROJECT (SP)' },
  ];
  public ownerHeader: string[] = ['fname', 'mname', 'lname', 'address', 'contact', 'tin', 'actions'];
  public adminHeader: string[] = ['fname', 'mname', 'lname', 'address', 'contact', 'tin', 'actions'];
  public strDescHeader: string[] = ['Floor No.', 'Area', 'Flooring Material', 'Wall Material', 'Floor Height', 'Standard Height', 'Adjusted Basic Rate', 'Floor Type'];
  public aItemHeader: string[] = ['aItm', 'sType', 'sizem2', 'untCost', 'totalC', 'actions'];
  ////////////////Class constructor////////////
  constructor() { }

  ////////////////Init component/////////////
  ngOnInit() {
    if(!localStorage.getItem('auth')) {
      window.location.href = '/'
    } else {
      this.initForm()
    }
  }

  ///////////////Methods/////////////////////
  //initialize whole form onInit
  initForm() {
    this.bldgAsmt = {
      trnsCode: '',
      arpNo: '',
      pin: {
        city: '',
        district: '',
        barangay: '',
        section: '',
        parcel: '',
        bldgNo: ''
      },
      ownerDetails: {
        ownFName: '',
        ownMName: '',
        ownLName: '',
        ownAddr: '',
        ownCont: '',
        ownTIN: ''
      },
      adminDetails: {
        admFName: '',
        admMName: '',
        admLName: '',
        admAddr: '',
        admCont: '',
        admTIN: ''
      },
      bldgLoc: {
        street: '',
        bLoc: '',
        prov: '',
        brgy: '',
        subd: ''
      },
      lndRef: {
        lndOwnr: '',
        lndCloa: '',
        lndSurveyNo: '',
        lndLotNo: '',
        lndBlkNo: '',
        lndArp: '',
        lndArea: ''
      },
      genDesc: {
        kind: '',
        strctType: '',
        bldgPermitNo: '',
        permitIssueOn: '',
        cCertTitle: '',
        cCertCompIssue: '',
        certOccDate: '',
        dateComp: '',
        dateOcc: '',
        aob: ''
      },
      strDesc: {
        storey: '',
        areaBldgFlrs: '',
        flrArea: '',
        cbSameArea: false,
        flrAFr: '',
        flrATo: '',
        roofMat: '',
        cbRoofOth: false,
        roofOthInput: '',
        flooringFlrs: '',
        flooringMat: '',
        cbFlooringOth: false,
        flooringOthInput: false,
        cbFlooringSameMat: false,
        flooringFr: '',
        flooringTo: '',
        wallFlrs: '',
        wallMat: '',
        cbWallOth: false,
        wallOthInput: '',
        cbWallSameMat: false,
        wallFr: '',
        wallTo: '',
        flrHeight: '',
        stdHeight: '',
        excDefHeight: '',
        floorType: '',
        baseRatePerMt: '',
        baseRateVal: '',
        addCost: '',
        bldgFlrs: '',
        adjBaseRate: '',
        cbFloorSameArea: false,
        floorHtFrom: '',
        floorHtTo: '',
        totalArea: '',
        totalCost: '',
      },
      additionalItems: {
        addItem: '',
        subType: '',
        size: '',
        unitCost: '',
        totalCost: '',
        subTotal: ''
      },
      propAppraisal: {
        cbUnpainted: '',
        cbSecHandMat: '',
        bldgType: '',
        bldgRating: '',
        bcUnitConstCost: '',
        bcSubTotal: '',
        aiSubTotal: '',
        aiConsCost: '',
        deprRate: '',
        deprCost: '',
        deprTotalPrc: '',
        deprMarkVal: ''
      },
      propAsmt: {
        actualUse: '',
        cbSpecCls: '',
        marketVal: '',
        status: '',
        asmtLvl: '',
        assessedVal: '',
        effQ: '',
        effY: '',
        total: '',
        appraisedBy: '',
        appraisedOn: '',
        recommending: '',
        recommendOn: '',
        approvedBy: '',
        approvedOn: '',
        memoranda: ''
      },
      supersededRec: {
        supPIN: '',
        supARPNo: '',
        supTDNo: '',
        supTotalAssessedVal: '',
        supPrevOwner: '',
        supEff: '',
        supRecPrn: '',
        supDate: ''
      }
    }
  }

  ////////////////Event handlers////////////

  selectTrnsCode() {

  }

  chckPIN(obj: any) {

  }

  addOwner(obj: any) {

  }

  addAdmin(obj: any) {

  }

  applyStrDscArea(obj: any) {

  }

  applyFlooring(obj: any) {

  }

  applywallPart(obj: any) {

  }

  areaSetBldgfloors(obj: any) {

  }

  cbtoggle(obj: any) {

  }

  flrMatsToggle(obj: any) {

  }

  cbtoggle2(obj: any) {

  }

  flrsmeMatsToggle(obj: any) {

  }

  computeFloorHeight(obj: any) {

  }

  setStandardHeight(obj: any) {

  }

  flrMatsToggle2(obj: any) {

  }

  bldgAge(obj: any) {

  }

  aiSubTypeItem(obj: any) {
    
  }

  save(evt: MouseEvent, form: any) {

  }

}

export default BuildingAssessmentComponent
