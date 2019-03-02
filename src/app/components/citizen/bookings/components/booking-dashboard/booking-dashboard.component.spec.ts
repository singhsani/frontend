import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule} from '@angular/router/testing'

import { BookingDashboardComponent } from './booking-dashboard.component';
import { TitleBarComponent } from '../../../../shared/components/title-bar/title-bar.component';
import { MaterialModule } from '../../../../shared/modules/material/material.module';

describe('Booking Dashboard : BookingDashboardComponent', () => {
  let component: BookingDashboardComponent;
  let fixture: ComponentFixture<BookingDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule, RouterTestingModule ],
      declarations: [ BookingDashboardComponent, TitleBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
