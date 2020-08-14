import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogFormComponentTempFire } from './dialog-form.component';

describe('DialogFormComponent', () => {
  let component: DialogFormComponentTempFire;
  let fixture: ComponentFixture<DialogFormComponentTempFire>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogFormComponentTempFire ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogFormComponentTempFire);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
