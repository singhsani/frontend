import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule} from '@angular/router/testing'

import { GuestHouseListComponent } from './guest-house-list.component';
import { TranslateModule } from '../../../../../shared/modules/translate/translate.module';
import { MaterialModule } from '../../../../../shared/modules/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { BookingService } from '../../../../../core/services/citizen/data-services/booking.service';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { HttpService } from '../../../../../shared/services/http.service';
import { TitleBarComponent } from '../../../../../shared/components/title-bar/title-bar.component';
import { SessionStorageService } from 'angular-web-storage';
import { CommonService } from '../../../../../shared/services/common.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('AtithiGruh : GuestHouseListComponent', () => {
  let component: GuestHouseListComponent;
  let fixture: ComponentFixture<GuestHouseListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        RouterTestingModule,
        MaterialModule,
        ReactiveFormsModule,
        ToastrModule.forRoot()],
      declarations: [GuestHouseListComponent,
        TitleBarComponent],
      providers: [BookingService,
        HttpService,
        SessionStorageService,
        CommonService,
        ToastrService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuestHouseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
