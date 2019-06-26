import { Component, OnInit } from '@angular/core';
import { selectOpt } from '../interfaces/selectOpt';

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

  constructor() { }

  ngOnInit() {
    if(!localStorage.getItem('auth')) {
      window.location.href ='/';
    }
  }

  search() {

  }

}
