import { Injectable } from '@angular/core';
import docxtemplater from 'docxtemplater';
import * as JSZip from 'jszip';
import * as JSZipUtils from 'jszip-utils';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class genLandTaxCl {

  private URL: string = '../assets/temp/clearance_template.docx';

  constructor(private http: HttpClient) { }

  loadFile(data: any): Observable<any> {
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
    //   let fileName = 'LTC_' + data.pin + '_' + data.current_date + '.docx';
    //   saveAs(outFile, fileName);
    // });
		let headers = new HttpHeaders({
			 'Content-Type': 'application/json',
			 'Authorization': 'Bearer ' + localStorage.getItem('auth')
		});
		let opt = { headers: headers };
		return this.http.post('http://192.168.100.24:5000/api/gen-clearance', data, opt);
  }
}
