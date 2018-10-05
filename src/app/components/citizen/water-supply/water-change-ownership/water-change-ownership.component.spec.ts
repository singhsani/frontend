import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaterChangeOwnershipComponent } from './water-change-ownership.component';

 describe('WaterChangeOwnershipComponent', () => {
  let component: WaterChangeOwnershipComponent;
  let fixture: ComponentFixture<WaterChangeOwnershipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaterChangeOwnershipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaterChangeOwnershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
