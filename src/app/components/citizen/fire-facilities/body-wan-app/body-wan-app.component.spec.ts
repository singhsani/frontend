import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BodyWanAppComponent } from './body-wan-app.component';

describe('BodyWanAppComponent', () => {
  let component: BodyWanAppComponent;
  let fixture: ComponentFixture<BodyWanAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BodyWanAppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BodyWanAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
