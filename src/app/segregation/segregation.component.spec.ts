import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SegregationComponent } from './segregation.component';

describe('SegregationComponent', () => {
  let component: SegregationComponent;
  let fixture: ComponentFixture<SegregationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SegregationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SegregationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
