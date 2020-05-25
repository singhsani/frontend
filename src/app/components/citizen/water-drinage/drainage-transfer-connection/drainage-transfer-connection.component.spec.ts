import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrainageTransferConnectionComponent } from './drainage-transfer-connection.component';

describe('DrainageTransferConnectionComponent', () => {
  let component: DrainageTransferConnectionComponent;
  let fixture: ComponentFixture<DrainageTransferConnectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrainageTransferConnectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrainageTransferConnectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
