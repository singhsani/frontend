import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTicketingsComponent } from './my-ticketings.component';

describe('MyTicketingsComponent', () => {
  let component: MyTicketingsComponent;
  let fixture: ComponentFixture<MyTicketingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyTicketingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyTicketingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
