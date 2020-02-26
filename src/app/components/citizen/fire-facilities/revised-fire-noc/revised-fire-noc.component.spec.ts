import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisedFireNOCComponent } from './revised-fire-noc.component';

describe('RevisedFireNOCComponent', () => {
  let component: RevisedFireNOCComponent;
  let fixture: ComponentFixture<RevisedFireNOCComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RevisedFireNOCComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RevisedFireNOCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
