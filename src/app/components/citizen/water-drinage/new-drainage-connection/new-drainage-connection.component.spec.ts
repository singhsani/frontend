import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDrainageConnectionComponent } from './new-drainage-connection.component';

describe('NewDrainageConnectionComponent', () => {
  let component: NewDrainageConnectionComponent;
  let fixture: ComponentFixture<NewDrainageConnectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewDrainageConnectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewDrainageConnectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
