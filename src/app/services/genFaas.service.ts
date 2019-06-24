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

@Injectable({
   providedIn: 'root'
})

export class genFaas {

   private URL: string = '../assets/temp/land_faas_template.docx';
   
   constructor(private http: HttpClient) { }

   generateLand(data: any): Observable<any> {
      let headers = new HttpHeaders({
         'Content-Type': 'application/json'
      });
      let opt = { headers: headers };
      return this.http.post('http://192.168.100.24:5000/api/get-faas', data, opt);
   }

   

   file(data: landFaasTmp) {
      JSZipUtils.getBinaryContent(this.URL, (err, cont) => {
         if (err) { throw err; }
         const zip = new JSZip(cont);
         const doc = new docxtemplater().loadZip(zip)
         doc.setData(data)
         try {
            doc.render()
         } catch (e) {
            console.log(JSON.stringify({ error: e }))
            throw e;
         }
         let outFile = doc.getZip().generate({
            type: 'blob',
            mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
         });
         let fileName = 'FAAS_' + data.pin + '_' + moment(new Date()).format('MM-DD-YYYY') + '.docx';
         saveAs(outFile, fileName);
      })
   }
}