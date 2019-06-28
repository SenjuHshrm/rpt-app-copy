import { Component, OnInit } from '@angular/core';
import { selectOpt } from '../interfaces/selectOpt';
import { searchSG } from '../services/searchSG.service';

@Component({
  selector: 'app-segregation',
  templateUrl: './segregation.component.html',
  styleUrls: ['./segregation.component.scss']
})
export class SegregationComponent implements OnInit {

  param: string = 'pin';
  req: string;

  params: selectOpt[] = [
    { value: 'pin', viewVal: 'PIN' },
    { value: 'arpNo', viewVal: 'ARP No.' },
    { value: 'name', viewVal: 'Name' }
  ];

  constructor(private ssg: searchSG) { }

  ngOnInit() {
    if(!localStorage.getItem('auth')) {
      window.location.href ='/';
    }
  }

  search() {
    if(this.req != null) {
      let data: any = {
        SearchBy: this.param,
        info: this.req,
        SysCaller: 'RPTAS'
      };
      this.ssg.search(data).subscribe(res => {
        console.log(res);
        if (res.success) {

        } else {

        }
      })
    } else {
      console.log('Empty input')
    }
  }

}
