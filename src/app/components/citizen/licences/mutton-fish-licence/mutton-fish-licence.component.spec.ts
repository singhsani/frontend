import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MuttonFishLicenceComponent } from './mutton-fish-licence.component';

describe('MuttonFishLicenceComponent', () => {
  let component: MuttonFishLicenceComponent;
  let fixture: ComponentFixture<MuttonFishLicenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MuttonFishLicenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MuttonFishLicenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
