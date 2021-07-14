import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractorRegsitrationComponent } from './contractor-regsitration.component';

describe('ContractorRegsitrationComponent', () => {
  let component: ContractorRegsitrationComponent;
  let fixture: ComponentFixture<ContractorRegsitrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractorRegsitrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractorRegsitrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
