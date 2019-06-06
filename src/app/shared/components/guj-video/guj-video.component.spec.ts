import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GujVideoComponent } from './guj-video.component';

describe('GujVideoComponent', () => {
  let component: GujVideoComponent;
  let fixture: ComponentFixture<GujVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GujVideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GujVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
