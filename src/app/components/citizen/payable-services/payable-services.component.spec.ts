import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayableServicesComponent } from './payable-services.component';

describe('PayableServicesComponent', () => {
  let component: PayableServicesComponent;
  let fixture: ComponentFixture<PayableServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayableServicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayableServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
