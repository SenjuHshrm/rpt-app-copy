import { Component, OnInit, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { searchRec } from '../../services/searchFaasRec.service';
import { selectOpt } from '../../interfaces/selectOpt';
import { landTaxTable } from '../../interfaces/landTaxTable';
import * as _ from 'lodash';

var dTable: landTaxTable[] = [];

@Component({
	selector: 'app-lndasmt-search',
	templateUrl: './lndasmt-search.html',
	styleUrls: ['./lndasmt-search.scss']
})

export class LndAsmtSearch implements OnInit {

	public searchBy: string = 'pin';
	public paramInfo: string;

	dataTable = new MatTableDataSource(dTable);
	selectedRow = [];
	idArray = [];

	infoHeader: string[] = [
		'arpNo', 'pin', 'surveyNo', 'lotNo', 'blockNo',
		'streetNo', 'brgy', 'subd', 'city', 'province',
		'class', 'subclass', 'area', 'assessedVal', 'stat'
	];

	constructor(
		public dRef: MatDialogRef<LndAsmtSearch>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private sRec: searchRec
	) { }

	ngOnInit() {

	}

	param1: selectOpt[] = [
		{ value: 'pin', viewVal: 'PIN' },
		{ value: 'arpNo', viewVal: 'ARP No.' },
		{ value: 'name', viewVal: 'Name' }
	]

	isVisible_spinner = false;
	search() {
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
			_.forEach(res.data.faas, (arr: any) => {
				this.idArray.push(arr.id)
				dTable.push({
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
			    assessedVal: arr.AssessedVal,
			    stat: arr.Status,
				});
			});
			this.dataTable = new MatTableDataSource(dTable);
			this.isVisible_spinner = false;
		});
	}

	tableRowSelected(row: any) {
		this.selectedRow = [];
		this.selectedRow.push(row);
		let ind = _.indexOf(dTable, row);
		this.data = this.idArray[ind];
	}

	close() {
		this.dRef.close();
	}


}
