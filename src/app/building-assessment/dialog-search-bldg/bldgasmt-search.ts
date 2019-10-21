import { Component, OnInit, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { searchRec } from '../../services/searchFaasRec.service';
import { selectOpt } from '../../interfaces/selectOpt';
import { landTaxTableBldg } from '../../interfaces/landTaxTableBldg';
import * as _ from 'lodash';

var dTable: landTaxTableBldg[] = [];

@Component({
	selector: 'app-bldgasmt-search',
	templateUrl: './bldgasmt-search.html',
	styleUrls: ['./bldgasmt-search.scss']
})

export class BldgAsmtBg implements OnInit {
	public searchBy: string = 'pin';
	public paramInfo: string;
	selectedInfo;

	dataTable = new MatTableDataSource(dTable);
	selectedRow = [];
	idArray = [];
	errMsg: string;
	faas: any;
	owner: any;
	admin: any;
	cancelBtn: boolean;
	okBtn: boolean;
	clckOk: boolean;
	srchmDwn: boolean;

	dialogBox: boolean = false;
	isVisible_spinner: boolean = false;


	constructor(
		public dRef: MatDialogRef<BldgAsmtBg>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private sRec: searchRec
	) { }

	param1: selectOpt[] = [
		{ value: 'pin', viewVal: 'PIN' },
		{ value: 'arpNo', viewVal: 'ARP No.' },
		{ value: 'name', viewVal: 'Name' }
	]

	ngOnInit() {
		dTable = [];
		this.dataTable = new MatTableDataSource(dTable);
		this.selectedInfo = 0;
		this.selectedRow = [];
	}

	infoHeader: string[] = [
		'arpNo', 'pin', 'brgy', 'subd', 'city',
    'province', 'kind', 'structType', 'bldgPermit', 'dateConstr',
    'storey', 'actualUse', 'assessedVal'
	];

	tableRowSelected(row: any) {
		this.selectedRow = [];
		this.selectedRow.push(row);
		let ind = _.indexOf(dTable, row);
		this.selectedInfo = this.idArray[ind];
	}

	close() {
		this.dRef.close();
	}

	disableBtn() {
		return (this.selectedRow.length < 1) ? true : false;
	}

	search() {
		if(this.paramInfo == null || this.paramInfo == "" || this.paramInfo.trim() === "")
		{
			this.dialogBox = true;
			this.errMsg = 'Empty input';
		}
		else if(this.searchBy == 'pin' && this.paramInfo.match(/^[ A-Za-z_@./#&+]*$/) || this.searchBy == 'arpNo' && this.paramInfo.match(/^[ A-Za-z_@./#&+]*$/))
		{
			this.dialogBox = true;
			this.errMsg = 'Invalid input value';
		}
		else if(this.searchBy === 'name' && typeof this.paramInfo === "string" && !Number.isNaN(Number(this.paramInfo)) || this.paramInfo.match(/^[ _@./#&+-]*$/))
		{
			this.dialogBox = true;
			this.errMsg = 'Invalid name';
		}
		else
		{
			if(this.searchBy == 'pin' || this.searchBy == 'arpNo')
			{
				this.paramInfo = this.paramInfo.trim().split(' ').join('-');
			}
			this.isVisible_spinner = true;
			dTable = [];
			this.dataTable = new MatTableDataSource(dTable);
			let data: any = {
				SearchIn: 'land',
				SearchBy: this.searchBy,
				info: '',
				sysCaller: 'RPTAS'
			};
			if(this.searchBy == 'pin' || this.searchBy == 'arpNo') {
				data.info = this.paramInfo.trim()
			} else {
				data.info = this.paramInfo
			}
			this.sRec.search(data).subscribe(res => {
				console.log(res)
				if(res.success)
				{
					let resdata = res.data;
          this.faas = resdata.faas;
          this.owner = resdata.owner;
          this.admin = resdata.admin;
					if(this.faas.length > 0 || this.owner.length > 0 || this.admin.length > 0)
          {
						_.forEach(res.data.faas, (arr: any) => {
							this.idArray.push(arr.id)
							dTable.push({
								id: arr.id,
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
					}
					else {
						this.dialogBox = true;
						this.errMsg = 'Data not found';
					}
				this.dataTable = new MatTableDataSource(dTable);
				this.isVisible_spinner = false;
				}
				else {
				}
			});
		}
	}
}
