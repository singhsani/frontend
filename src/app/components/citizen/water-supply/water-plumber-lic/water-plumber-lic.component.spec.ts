import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaterPlumberLicComponent } from './water-plumber-lic.component';

 describe('WaterPlumberLicComponent', () => {
  let component: WaterPlumberLicComponent;
  let fixture: ComponentFixture<WaterPlumberLicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaterPlumberLicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaterPlumberLicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
