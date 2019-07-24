import { Component, OnInit, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { searchRec } from '../../services/searchFaasRec.service';
import { selectOpt } from '../../interfaces/selectOpt';
import { landTaxTable } from '../../interfaces/landTaxTable';
import * as _ from 'lodash';

@Component({
	selector: 'app-lndreasmt-search',
	templateUrl: './lndreasmt-search.html',
	styleUrls: ['./lndreasmt-search.scss']
})

export class LndReasmtSearch implements OnInit {
	ngOnInit() {

	}
}
