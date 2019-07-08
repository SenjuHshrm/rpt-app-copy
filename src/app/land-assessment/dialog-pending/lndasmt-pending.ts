import { Component, OnInit, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as _ from 'lodash';
import { landAsmtPending } from '../../services/landAsmtPending.service';
import { lndAsmtPendingIntf } from '../../interfaces/lndAsmtPending';

var dataSource: lndAsmtPendingIntf[] = [];

@Component({
	selector: 'app-lndasmt-pending',
	templateUrl: './lndasmt-pending.html',
	styleUrls: ['./lndasmt-pending.scss']
})

export class LndAsmtPending implements OnInit{

	headerText: string = '';
	pendingTable = new MatTableDataSource(dataSource);
	selectedRow = [];
	idArray = [];


	constructor(
		public lPending: landAsmtPending,
		public dRef: MatDialogRef<LndAsmtPending>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) { }

	tableHeader: string[] = [
		'arpNo', 'pin', 'surveyNo', 'lotNo', 'blockNo',
		'streetNo', 'brgy', 'subd', 'city', 'province',
		'class', 'subclass', 'area', 'stat',
	];

	ngOnInit() {
		this.loadPendingTransactions(this.data.tCode)
	}

	loadPendingTransactions(opt: string) {
		switch(opt) {
			case 'SUBDIVISION':
				this.headerText = 'Pending subdivided lands';
				break;
			case 'SEGREGATION':
				this.headerText = 'Pending segregated lands';
				break;
			case 'CONSOLIDATION':
				this.headerText = 'Pending consolidated lands';
				break;
		}
		this.lPending.getPending(opt).subscribe(res => {
			console.log(res)
			_.forEach(res, (arr: any) => {
				this.idArray.push(arr.id);
				dataSource.push({
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
					stat: arr.Status,
				});
			});
			this.pendingTable = new MatTableDataSource(dataSource);
		});
	}

	tableRowSelected(row: any) {
		this.selectedRow = [];
		this.selectedRow.push(row);
		let ind = _.indexOf(dataSource, row);
		this.data = this.idArray[ind];
	}

	close() {
		this.dRef.close();
	}
}
