import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmbulanceAppComponent } from './ambulance-app.component';

describe('AmbulanceAppComponent', () => {
  let component: AmbulanceAppComponent;
  let fixture: ComponentFixture<AmbulanceAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmbulanceAppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmbulanceAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
