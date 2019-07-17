import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrearsComponent } from './arrears.component';

describe('ArrearsComponent', () => {
  let component: ArrearsComponent;
  let fixture: ComponentFixture<ArrearsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArrearsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArrearsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
