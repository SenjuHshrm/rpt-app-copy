import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import docxtemplater from 'docxtemplater';
import * as JSZip from 'jszip';
import * as JSZipUtils from 'jszip-utils';
import { saveAs } from 'file-saver';
import * as _ from 'lodash';

@Injectable({
   providedIn: 'root'
})
export class genTaxDec {

	URL: string = '../assets/temp/tax_declaration_template.docx';

   constructor(private http: HttpClient) { }

   generateLand(data: any): Observable<any> {
      let headers = new HttpHeaders({
         'Content-Type': 'application/json',
         'Authorization': 'Bearer ' + localStorage.getItem('auth')
      });
      let opt = { headers: headers };
      return this.http.get('http://192.168.100.24:5000/api/get-faas/land/' + data.id, opt);
   }

   file(data: any): Observable<any> {
		 // JSZipUtils.getBinaryContent(this.URL, (err, cont) => {
     //   if (err) { throw err; }
     //   const zip = new JSZip(cont);
     //   const doc = new docxtemplater().loadZip(zip)
     //   doc.setData(data)
     //   try {
     //     doc.render()
     //   } catch (e) {
     //     console.log(JSON.stringify({ error: e }))
     //     throw e;
     //   }
     //   let outFile = doc.getZip().generate({
     //     type: 'blob',
     //     mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
     //   });
     //   let fileName = 'TD_' + data.pin + '_' + data.diag_date_printed + '.docx';
     //   saveAs(outFile, fileName);
     // });
		 let headers = new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + localStorage.getItem('auth')
		 });
		 let opt = { headers: headers };
		 return this.http.post('http://192.168.100.24:5000/api/gen-taxdec', data, opt);
   }
}
