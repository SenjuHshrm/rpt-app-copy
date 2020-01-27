import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import * as _ from 'lodash';
import { adminOwner } from '../interfaces/adminOwner';
import { landOwner } from '../interfaces/landOwner';
import { bldgStructDesc} from '../interfaces/bldgStructDesc';
import { getBldgVals } from '../services/getBldgVals.service';
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
  addItem: string;
  subType: string;
  size: string;
  unitCost: string;
  totalCost: string;
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
  public strcDesc = new MatTableDataSource(strDsc);
  public addItemsTable = new MatTableDataSource(addtnlItems);
  ////////////////default values///////////////
  public bldgIncr: any;
  public bldgRate: any;
  public bldgSpDpr: any;
  public bldgStHt: any;
  public bldgStrcMat: any;
  public bldgType: any;
  public bldgMrkVl: any;
  public bldgAsmtLvl: any;
  public bldgPosHolder: any;
  public isVisible_spinner: boolean = false
  public qrtrOpts: selectOpt[] = []
  public statsOpts: selectOpt[] = []
  //struct materials
  public roofMat: selectOpt[] = []
  public flooringMat: selectOpt[] = []
  public wallMat: selectOpt[] = []
  //gendesc unit value
  public kof: selectOpt[] = [];
  public st: selectOpt[] = [];
  //stuct desc bldg floors
  public areaBldgFlr: selectOpt[] = [];
  public flrAreaFrom: selectOpt[] = [];
  public flrAreaTo: selectOpt[] = [];
  public flooringBldgFlr: selectOpt[] = [];
  public flrFloorMatFr: selectOpt[] = [];
  public flrFloorMatTo: selectOpt[] = [];
  public wallPrtFlrs: selectOpt[] = [];
  public wallPrtFr: selectOpt[] = [];
  public wallPrtTo: selectOpt[] = [];
  public bldgHtFlrs: selectOpt[] = [];
  public flrHtFr: selectOpt[] = [];
  public flrHtTo: selectOpt[] = [];
  //floor type
  public floortypeOpts: selectOpt[] = [];
  //additional items
  public aItemOpts: selectOpt[] = [];
  public stOpts: selectOpt[] = [];
  //property appraisal
  public toBldg: selectOpt[] = [];
  public bRating: selectOpt[] = [];
  //property asmt
  public actualUseOpts: selectOpt[] = [];

  public bldgOpt: selectOpt[] = [
    { value: 'DISCOVERY / NEW DECLARATION (DC)', viewVal: 'DISCOVERY / NEW DECLARATION (DC)' },
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
  constructor(
    private bldgVals: getBldgVals,
    private mDialog: MatDialog
  ) { }

  ////////////////Init component/////////////
  ngOnInit() {
    this.bldgVals.getVals().subscribe(res => {
      console.log(res)
      this.bldgIncr = res.res.bldgInc
      this.bldgRate = res.res.bldgRate
      this.bldgSpDpr = res.res.bldgSpDepr
      this.bldgStHt = res.res.bldgStHt
      this.bldgStrcMat = res.res.bldgStrcMat
      this.bldgType = res.res.bldgType
      this.bldgMrkVl = res.res.bldgMrkVal
      this.bldgAsmtLvl = res.res.bldgAsmtLvl
      this.bldgPosHolder = res.res.bldgPosHolders

      //struct mat
      _.forEach(this.bldgStrcMat, arr => {
        switch(arr.type) {
          case 'ROOF':
            this.roofMat.push({
              value: arr.sub_type,
              viewVal: arr.sub_type
            })
            break;
          case 'WALL':
            this.wallMat.push({
              value: arr.sub_type,
              viewVal: arr.sub_type
            })
            break;
          default:
            this.flooringMat.push({
              value: arr.sub_type,
              viewVal: arr.sub_type
            })
        }
      })

      //gendesc type subtype
      let kb = Array.from(new Set(this.bldgMrkVl.map(x => x.type)))
      _.forEach(kb, (arr: string) => {
        this.kof.push({
          value: arr,
          viewVal: arr
        })
      })
      _.forEach(this.bldgMrkVl, arr => {
        if(arr.type == 'ONE FAMILY RESIDENCE') {
          this.st.push({
            value: arr.class,
            viewVal: arr.class
          })
        }
      })

      //standard height
      _.forEach(this.bldgStHt, arr => {
        this.floortypeOpts.push({
          value: arr.type,
          viewVal: arr.type
        })
      })

      //market value increment
      let addItem = Array.from(new Set(this.bldgIncr.map(x => x.type)))
      _.forEach(addItem, (arr: string) => {
        this.aItemOpts.push({
          value: arr,
          viewVal: arr
        })
      })
      _.forEach(this.bldgIncr, arr => {
        if(arr.type == 'FOUNDATIONS') {
          this.stOpts.push({
            value: arr.sub_type,
            viewVal: arr.sub_type
          })
        }
      })

      //bldg type
      _.forEach(this.bldgType, arr => {
        this.toBldg.push({
          value: arr.type,
          viewVal: arr.type
        })
      })

      //bldg rate
      _.forEach(this.bldgRate, arr => {
        this.bRating.push({
          value: arr.type,
          viewVal: arr.type
        })
      })

      //asmt lvl
      let asmtLvls = Array.from(new Set(this.bldgAsmtLvl.map(x => x.class)))
      _.forEach(asmtLvls, (arr: string) => {
        this.actualUseOpts.push({
          value: arr,
          viewVal: arr
        })
      })




    })
    this.initForm()
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
        kind: 'ONE FAMILY RESIDENCE',
        strctType: 'I',
        bldgPermitNo: '',
        permitIssueOn: new Date(),
        cCertTitle: '',
        cCertCompIssue: new Date(),
        certOccDate: new Date(),
        dateComp: new Date(),
        dateOcc: new Date(),
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
        flooringOthInput: '',
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
        stdHeight: '2.4',
        excDefHeight: '0',
        floorType: 'ONE-STOREY',
        baseRatePerMt: '10',
        baseRateVal: '700.0000',
        addCost: '0.00',
        bldgFlrs: '',
        adjBaseRate: '0.00',
        cbFloorSameArea: false,
        floorHtFrom: '',
        floorHtTo: '',
        totalArea: '0',
        totalCost: '0',
      },
      additionalItems: {
        addItem: '',
        subType: '',
        size: '0',
        unitCost: '',
        totalCost: '0.00',
        subTotal: '0.00'
      },
      propAppraisal: {
        cbUnpainted: '',
        cbSecHandMat: '',
        bldgType: 'LIGHT MATERIAL',
        bldgRating: 'GOOD',
        bcUnitConstCost: '0.00',
        bcSubTotal: '0.00',
        aiSubTotal: '0.00',
        aiConsCost: '0.00',
        deprRate: '0',
        deprCost: '0',
        deprTotalPrc: '0',
        deprMarkVal: '0.00'
      },
      propAsmt: {
        actualUse: 'RESIDENTIAL',
        cbSpecCls: false,
        marketVal: '0',
        status: '',
        asmtLvl: '0',
        assessedVal: '0',
        effQ: '',
        effY: '',
        total: '0.00',
        appraisedBy: '',
        appraisedOn: new Date(),
        recommending: '',
        recommendOn: new Date(),
        approvedBy: '',
        approvedOn: new Date(),
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

  selectTrnsCode(code: any) {
    let md: any;
    if(code == 'DISCOVERY / NEW DECLARATION (DC)') {
      md = this.mDialog.open(BldgAsmtLnd, { disableClose: true, width: '90%', height: '90%', data: { tc: 'Land FAAS' }, panelClass: 'custom-dialog-container' })
    } else {
      md = this.mDialog.open(BldgAsmtBg, { disableClose: true, width: '90%', height: '90%', data: { tc: 'Building FAAS' }, panelClass: 'custom-dialog-container' })
    }
    md.afterClosed().subscribe(res => {
      if(res == undefined) {
        this.bldgAsmt.trnsCode = ''
      } else {
        console.log(res)
      }
    })
  }

  chckPIN(obj: any) {

  }

  addOwner(obj: any) {
    ownerLs.push({
      ownFName: obj.ownFName.toUpperCase(),
      ownMName: obj.ownMName.toUpperCase(),
      ownLName: obj.ownLName.toUpperCase(),
      ownAddress: obj.ownAddr.toUpperCase(),
      ownContact: obj.ownCont.toUpperCase(),
      ownTIN:obj.ownTIN.toUpperCase()
    })
    this.ownersLs = new MatTableDataSource(ownerLs)
  }

  removeOwnerDetail(row: any) {
    _.pull(ownerLs, row)
    this.ownersLs = new MatTableDataSource(ownerLs)
  }

  addAdmin(obj: any) {
    adminLs.push({
      admFName: obj.admFName.toUpperCase(),
      admMName: obj.admMName.toUpperCase(),
      admLName: obj.admLName.toUpperCase(),
      admAddress: obj.admAddr.toUpperCase(),
      admContact: obj.admCont.toUpperCase(),
      admTIN:obj.admTIN.toUpperCase()
    })
    this.adminsLs = new MatTableDataSource(adminLs)
  }

  removeAdminDetail(row: any) {
    _.pull(adminLs, row)
    this.adminsLs = new MatTableDataSource(adminLs)
  }

  setBldgTypes(obj: any) {
    let typ = [];
    this.st = []
    _.forEach(this.bldgMrkVl, arr => {
      if(arr.type == obj.kind) {
        typ.push(arr)
      }
    })
    for(let i = 0; i < typ.length; i++) {
      this.st.push({
        value: typ[i].class,
        viewVal: typ[i].class
      })
    }
    obj.strctType = typ[0].class
    this.setRateVal(obj)
  }

  setRateVal(obj: any) {
    let x = _.find(this.bldgMrkVl, { type: obj.kind, class: obj.strctType })
    this.bldgAsmt.strDesc.baseRateVal = x.unit_market_value
  }

  applyStrDscArea(obj: any) {
    if(obj.cbSameArea) {
      for(let i = +obj.flrAFr; i <= +obj.flrATo; i++) {
        strDsc[i-1].area = obj.flrArea
      }
    } else {
      let ind = _.findIndex(strDsc, { floorNo: obj.areaBldgFlrs })
      strDsc[ind].area = obj.flrArea
    }
    let totalArea = 0;
    _.forEach(strDsc, arr => {
      totalArea = totalArea + +arr.area
    })
    obj.totalArea = totalArea.toString()
  }

  applyFlooring(obj: any) {
    let fMat = (obj.cbFlooringOth) ? obj.flooringOthInput.toUpperCase() : obj.flooringMat;
    if(obj.cbFlooringSameMat) {
      for(let i = +obj.flooringFr; i <= +obj.flooringTo; i++) {
        strDsc[i-1].flooringMat = fMat
      }
    } else {
      let ind = _.findIndex(strDsc, { floorNo: obj.flooringFlrs })
      strDsc[ind].flooringMat = fMat
    }
  }

  applywallPart(obj: any) {
    let wMat = (obj.cbWallOth) ? obj.wallOthInput.toUpperCase() : obj.wallMat;
    if(obj.cbWallSameMat) {
      for(let i = +obj.wallFr; i <= +obj.wallTo; i++) {
        strDsc[i-1].wallMat = wMat
      }
    } else {
      let ind = _.findIndex(strDsc, { floorNo: obj.wallFlrs })
      strDsc[ind].wallMat = wMat
    }
  }

  areaSetBldgfloors(obj: any) {
    strDsc = [];
    this.areaBldgFlr = [];
    this.flrAreaFrom = [];
    this.flrAreaTo = [];
    this.flooringBldgFlr = [];
    this.flrFloorMatFr = [];
    this.flrFloorMatTo = [];
    this.wallPrtFlrs = [];
    this.wallPrtFr = [];
    this.wallPrtTo = [];
    this.bldgHtFlrs = [];
    this.flrHtFr = [];
    this.flrHtTo = [];
    for(let i = 1; i <= +obj.storey; i++) {
      this.areaBldgFlr.push({
        value: i.toString(),
        viewVal: i.toString()
      })
      this.flrAreaFrom.push({
        value: i.toString(),
        viewVal: i.toString()
      })
      this.flrAreaTo.push({
        value: i.toString(),
        viewVal: i.toString()
      })
      this.flooringBldgFlr.push({
        value: i.toString(),
        viewVal: i.toString()
      })
      this.flrFloorMatFr.push({
        value: i.toString(),
        viewVal: i.toString()
      })
      this.flrFloorMatTo.push({
        value: i.toString(),
        viewVal: i.toString()
      })
      this.wallPrtFlrs.push({
        value: i.toString(),
        viewVal: i.toString()
      })
      this.wallPrtFr.push({
        value: i.toString(),
        viewVal: i.toString()
      })
      this.wallPrtTo.push({
        value: i.toString(),
        viewVal: i.toString()
      })
      this.bldgHtFlrs.push({
        value: i.toString(),
        viewVal: i.toString()
      })
      this.flrHtFr.push({
        value: i.toString(),
        viewVal: i.toString()
      })
      this.flrHtTo.push({
        value: i.toString(),
        viewVal: i.toString()
      })
      strDsc.push({
        floorNo: i.toString(),
        area: '0',
        flooringMat: '',
        wallMat: '',
        floorHeight: '0',
        standardHeight: '',
        adjBaseRate: '0',
        floorType: ''
      })
    }
    this.strcDesc = new MatTableDataSource(strDsc)
    obj.totalArea = '0';
    obj.totalCost = '0';
  }

  computeFloorHeight(obj: any) {
    obj.excDefHeight = ((+obj.flrHeight - +obj.stdHeight).toFixed(2)).toString();
    obj.addCost = ((+obj.baseRateVal * ((+obj.baseRatePerMt / 100) * +obj.excDefHeight)).toFixed(2)).toString()
    obj.adjBaseRate = ((+obj.baseRateVal + +obj.addCost).toFixed(2)).toString()
  }

  applyStHeight(obj: any) {
    if(obj.cbFloorSameArea) {
      for(let i = +obj.floorHtFrom; i <= +obj.floorHtTo; i++) {
        strDsc[i-1].floorHeight = obj.flrHeight;
        strDsc[i-1].standardHeight = obj.stdHeight;
        strDsc[i-1].adjBaseRate = obj.adjBaseRate;
        strDsc[i-1].floorType = obj.floorType;
      }
    } else {
      let ind = _.findIndex(strDsc, { floorNo: obj.bldgFlrs });
      strDsc[ind].floorHeight = obj.flrHeight;
      strDsc[ind].standardHeight = obj.stdHeight;
      strDsc[ind].adjBaseRate = obj.adjBaseRate;
      strDsc[ind].floorType = obj.floorType;
    }
    let totalCost = 0;
    _.forEach(strDsc, arr => {
      totalCost = totalCost + (+arr.area * +arr.adjBaseRate);
    })
    obj.totalCost = (totalCost.toFixed(2)).toString()
    this.bldgAsmt.propAppraisal.bcUnitConstCost = obj.baseRateVal
    this.bldgAsmt.propAppraisal.bcSubTotal = (totalCost.toFixed(2)).toString()
    this.setDepreciation(this.bldgAsmt.propAppraisal)
  }

  setStandardHeight(obj: any) {
    let x = _.find(this.bldgStHt, { type: obj.floorType })
    obj.stdHeight = x.standard_height
    this.computeFloorHeight(obj)
  }

  bldgAge(obj: any) {

    obj.aob = (moment(new Date())).diff(moment(obj.dateComp), 'years').toString()
    this.setDepreciation(this.bldgAsmt.propAppraisal)
  }

  aiSubTypeItem(obj: any) {

    this.stOpts = [];
    let st: any = [];
    _.forEach(this.bldgIncr, arr => {
      if(arr.type == obj.addItem) {
        st.push(arr)
        this.stOpts.push({
          value: arr.sub_type,
          viewVal: arr.sub_type
        })
      }
    })
    obj.subType = st[0].sub_type
    this.getUnitCost(obj)
  }

  getUnitCost(obj : any) {
    _.forEach(this.bldgIncr, arr => {
      if(arr.type == obj.addItem && arr.sub_type == obj.subType) {
        obj.unitCost = arr.increment_value
      }
    })
    this.cmpAiTotalCost(obj)
  }

  cmpAiTotalCost(obj: any) {
    obj.totalCost = ((+obj.unitCost * +obj.size).toFixed(2)).toString()
  }

  addAddItems(obj: any) {
    addtnlItems.push({
      addItem: obj.addItem,
      subType: obj.subType,
      size: obj.size,
      unitCost: obj.unitCost,
      totalCost: obj.totalCost,
    })
    this.addItemsTable = new MatTableDataSource(addtnlItems)
    this.computeAiSubTotal()
    this.setDepreciation(this.bldgAsmt.propAppraisal)
  }

  computeAiSubTotal() {
    let i = 0;
    _.forEach(addtnlItems, arr => {
      i = i + +arr.totalCost;
    })
    this.bldgAsmt.additionalItems.subTotal = (i.toFixed(2)).toString()
    this.bldgAsmt.propAppraisal.aiSubTotal = (i.toFixed(2)).toString()
  }

  removeAI(row: any) {
    _.pull(addtnlItems, row);
    this.addItemsTable = new MatTableDataSource(addtnlItems)
    this.computeAiSubTotal()
  }

  setDepreciation(obj: any) {

    obj.aiConsCost = ((+obj.bcSubTotal + +obj.aiSubTotal).toFixed(2)).toString()
    let dp = _.find(this.bldgType, { type: obj.bldgType })
    let depRate = +this.bldgAsmt.genDesc.aob * dp.depreciation_rate;
    obj.deprRate = depRate.toString()
    let netDepRt = (depRate > dp.maximum_net_depreciation) ? dp.maximum_net_depreciation : depRate ;

    if(obj.cbUnpainted) {
      let x = _.find(this.bldgSpDpr, { type: 'UNPAINTED' })
      netDepRt = netDepRt + x.depreciation
    }

    if(obj.cbSecHandMat) {
      let x = _.find(this.bldgSpDpr, { type: 'SECOND HAND MATERIALS' })
      netDepRt = netDepRt + x.depreciation
    }

    let bRt = _.find(this.bldgRate, { type: obj.bldgRating })
    netDepRt = netDepRt + bRt.depreciation

    obj.deprTotalPrc = netDepRt.toString()
    obj.deprCost = (((netDepRt / 100) * +obj.aiConsCost).toFixed(2)).toString()
    obj.deprMarkVal = ((+obj.aiConsCost - +obj.deprCost).toFixed(2)).toString()
    this.bldgAsmt.propAsmt.marketVal = ((+obj.aiConsCost - +obj.deprCost).toFixed(2)).toString()
    this.compAsdVal(this.bldgAsmt.propAsmt)
  }

  compAsdVal(obj: any) {

    let asmtLvls = [];
    _.forEach(this.bldgAsmtLvl, arr => {
      if(obj.actualUse == arr.class) {
        asmtLvls.push(arr)
      }
    })
    _.forEach(asmtLvls, arr => {
      if(+obj.marketVal > +arr.lower_treshold && +obj.marketVal <= +arr.upper_treshold) {
        obj.asmtLvl = arr.assessment_level.toString()
      }
    })
    obj.assessedVal = (((+obj.marketVal / 100) * +obj.asmtLvl).toFixed(2)).toString()
    obj.total = (((+obj.marketVal / 100) * +obj.asmtLvl).toFixed(2)).toString()
  }

  save(evt: MouseEvent, form: any) {

  }

  resetForm() {
    this.ngOnInit()
  }

}

export default BuildingAssessmentComponent
