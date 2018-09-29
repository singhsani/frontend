import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing'
import { HttpClientTestingModule } from "@angular/common/http/testing";

import { StadiumListComponent } from './stadium-list.component';
import { MaterialModule } from '../../../../../shared/modules/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TitleBarComponent } from '../../../../../shared/components/title-bar/title-bar.component';
import { BookingService } from '../../../../../core/services/citizen/data-services/booking.service';
import { HttpService } from '../../../../../shared/services/http.service';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { TranslateModule } from '../../../../../shared/modules/translate/translate.module';
import { SessionStorageService } from 'angular-web-storage';
import { CommonService } from '../../../../../shared/services/common.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('Stadium Booking : StadiumListComponent', () => {
  let component: StadiumListComponent;
  let fixture: ComponentFixture<StadiumListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule,
        BrowserAnimationsModule,
        TranslateModule,
        ReactiveFormsModule,
        RouterTestingModule,
        ToastrModule.forRoot(),
        HttpClientTestingModule],
      declarations: [StadiumListComponent,
        TitleBarComponent],
      providers: [BookingService, 
        HttpService, 
        CommonService,
        SessionStorageService, 
        ToastrService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StadiumListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
