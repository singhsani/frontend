import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HosMyApplicationsComponent } from './hos-my-applications.component';

describe('HosMyApplicationsComponent', () => {
  let component: HosMyApplicationsComponent;
  let fixture: ComponentFixture<HosMyApplicationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HosMyApplicationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HosMyApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
