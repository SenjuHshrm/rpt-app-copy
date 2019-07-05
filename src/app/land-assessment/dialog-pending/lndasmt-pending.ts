import { Component, OnInit, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
	selector: 'app-lndasmt-pending',
	templateUrl: './lndasmt-pending.html',
	styleUrls: ['./lndasmt-pending.scss']
})

export class LndAsmtPending implements OnInit{



	constructor(
		public dRef: MatDialogRef<LndAsmtPending>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) { }

	ngOnInit() {

	}
}
