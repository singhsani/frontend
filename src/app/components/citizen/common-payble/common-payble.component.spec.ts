import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonPaybleComponent } from './common-payble.component';

describe('CommonPaybleComponent', () => {
  let component: CommonPaybleComponent;
  let fixture: ComponentFixture<CommonPaybleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonPaybleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonPaybleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
