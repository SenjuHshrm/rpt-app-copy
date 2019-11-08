import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import docxtemplater from 'docxtemplater';
import * as JSZip from 'jszip';
import * as JSZipUtils from 'jszip-utils';
import { saveAs } from 'file-saver';
import * as moment from 'moment';
import { landFaasTmp } from '../classes/landFaasTmp';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { bldgFaasTmp } from '../classes/bldgFaasTmp';
import config from '../default/config';
@Injectable({
   providedIn: 'root'
})

export class genFaas {

   private URL_land: string = '../assets/temp/land_faas_template.docx';
   private URL_bldg: string = '../assets/temp/building_faas_template.docx';

   constructor(private http: HttpClient) { }

   generateLand(data: any): Observable<any> {
      let headers = new HttpHeaders({
         'Content-Type': 'application/json',
         'Authorization': 'Bearer ' + localStorage.getItem('auth')
      });
      let opt = { headers: headers };
			let id = data.id,
					URI = config.api + '/api/get-faas/land/' + id;
      return this.http.get(URI, opt);
   }

   generateBldg(data: any): Observable<any> {
      let headers = new HttpHeaders({
         'Content-Type': 'application/json',
         'Authorization': 'Bearer ' + localStorage.getItem('auth')
      });
      let opt = { headers: headers };
			let id = data.id,
					URI = config.api + '/api/get-faas/bldg/' + id;
      return this.http.get(URI, opt);
   }



   fileLand(data: landFaasTmp): Observable<any> {
			let headers = new HttpHeaders({
         'Content-Type': 'application/json',
         'Authorization': 'Bearer ' + localStorage.getItem('auth')
      });
      let opt = { headers: headers };
			return this.http.post(config.api + '/api/gen-land-faas', data, opt);
   }

   fileBldg(data: bldgFaasTmp) {
			let headers = new HttpHeaders({
         'Content-Type': 'application/json',
         'Authorization': 'Bearer ' + localStorage.getItem('auth')
      });
      let opt = { headers: headers };
			return this.http.post(config.api + '/api/gen-bldg-faas', data, opt);
   }
}
