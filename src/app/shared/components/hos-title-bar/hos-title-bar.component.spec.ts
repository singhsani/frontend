import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HosTitleBarComponent } from './hos-title-bar.component';

describe('HosTitleBarComponent', () => {
  let component: HosTitleBarComponent;
  let fixture: ComponentFixture<HosTitleBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HosTitleBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HosTitleBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
