import { stripInfo } from './../interfaces/stripInfo';
import { improvementInfo } from './../interfaces/improvementInfo';
import { marketValue } from './../interfaces/marketValue';
import { landOwner } from './../interfaces/landOwner';
import { adminOwner } from './../interfaces/adminOwner';

export class landAsmtDataTemp {
	trnsCode: string;
	arpNo: string;
	pin: {
		city: string;
		district: string;
		barangay: string;
		section: string;
		parcel: string;
	};
	OCT_TCT: string;
	surveyNo: string;
	lotNo: string;
	blockNo: string;
	propLoc: {
		streetNo: string;
		brgy: string;
		subd: string;
		city: string;
		province: string;
		north: string;
		south: string;
		east: string;
		west: string;
	};
	ownerDetails: landOwner[];
	adminDetails: adminOwner[];
	landAppraisal: {
		class: string;
		subCls: string;
		area: string;
		unitVal: string;
		baseMarketVal: string;
		interiorLot: string;
		cornerLot: string;
		stripping: string;
	};
	stripSet: stripInfo[];
	othImp: improvementInfo[];
	marketVal: marketValue[];
	propAsmt: {
		actualUse: string;
		marketVal: string;
		assessmentLvl: string;
		assessedVal: string;
		specialClass: string;
		status: string;
		efftQ: string;
		effty: string;
		total: string;
		appraisedName: string;
		appraisedDate: string;
		recommendName: string;
		recommendDate: string;
		approvedName: string;
		approvedDate: string;
		memoranda: string;
	};
	supersededRec: {
		supPin: string;
		supArpNo: string;
		supTDNo: string;
		supTotalAssessedVal: string;
		supPrevOwner: string;
		supEff: string;
		supARPageNo: string;
		supRecPersonnel: string;
		supDate: string;
	};
	status: string;
	dateCreated: string;
	encoder: string;
	attachment: string;
}
