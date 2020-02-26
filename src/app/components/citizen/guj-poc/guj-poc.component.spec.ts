import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GujPocComponent } from './guj-poc.component';

xdescribe('GujPocComponent', () => {
  let component: GujPocComponent;
  let fixture: ComponentFixture<GujPocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GujPocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GujPocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
