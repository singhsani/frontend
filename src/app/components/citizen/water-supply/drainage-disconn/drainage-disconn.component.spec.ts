import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrainageDisconnComponent } from './drainage-disconn.component';

describe('DrainageDisconnComponent', () => {
  let component: DrainageDisconnComponent;
  let fixture: ComponentFixture<DrainageDisconnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrainageDisconnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrainageDisconnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
