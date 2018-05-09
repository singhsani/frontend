import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrainageChangeOwnershipComponent } from './drainage-change-ownership.component';

describe('DrainageChangeOwnershipComponent', () => {
  let component: DrainageChangeOwnershipComponent;
  let fixture: ComponentFixture<DrainageChangeOwnershipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrainageChangeOwnershipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrainageChangeOwnershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
