import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AarogyaParvanoNocComponent } from './aarogya-parvano-noc.component';

describe('AarogyaParvanoNocComponent', () => {
  let component: AarogyaParvanoNocComponent;
  let fixture: ComponentFixture<AarogyaParvanoNocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AarogyaParvanoNocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AarogyaParvanoNocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
