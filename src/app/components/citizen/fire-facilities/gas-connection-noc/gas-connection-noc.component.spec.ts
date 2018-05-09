import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GasConnectionNocComponent } from './gas-connection-noc.component';

describe('GasConnectionNocComponent', () => {
  let component: GasConnectionNocComponent;
  let fixture: ComponentFixture<GasConnectionNocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GasConnectionNocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GasConnectionNocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
