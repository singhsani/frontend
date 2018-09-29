import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelBookingComponent } from './cancel-booking.component';
import { MaterialModule } from '../../../../shared/modules/material/material.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '../../../../shared/modules/translate/translate.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { TitleBarComponent } from '../../../../shared/components/title-bar/title-bar.component';
import { BookingService } from '../../../../core/services/citizen/data-services/booking.service';
import { HttpService } from '../../../../shared/services/http.service';
import { SessionStorageService } from 'angular-web-storage';
import { CommonService } from '../../../../shared/services/common.service';
import { PaginationService } from '../../../../core/services/citizen/data-services/pagination.service';
import { BsModalService,ModalModule } from 'ngx-bootstrap';

describe('Cancel Booking : CancelBookingComponent', () => {
  let component: CancelBookingComponent;
  let fixture: ComponentFixture<CancelBookingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        RouterTestingModule,
        TranslateModule,
        NgSelectModule,
        ModalModule.forRoot(),
        ReactiveFormsModule,
        ToastrModule.forRoot({
          timeOut: 5000,
          positionClass: 'toast-top-right',
          preventDuplicates: true,
          progressBar: true,
          closeButton: true
        })],
      declarations: [CancelBookingComponent, TitleBarComponent],
      providers: [BookingService,
        HttpService,
        CommonService,
        PaginationService,
        BsModalService,
        SessionStorageService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
