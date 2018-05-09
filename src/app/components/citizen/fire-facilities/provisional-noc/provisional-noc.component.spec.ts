import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvisionalNocComponent } from './provisional-noc.component';

describe('ProvisionalNocComponent', () => {
  let component: ProvisionalNocComponent;
  let fixture: ComponentFixture<ProvisionalNocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProvisionalNocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvisionalNocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
