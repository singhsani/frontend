import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZooDashboardComponent } from './zoo-dashboard.component';

describe('ZooDashboardComponent', () => {
  let component: ZooDashboardComponent;
  let fixture: ComponentFixture<ZooDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZooDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZooDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
