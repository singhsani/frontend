import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing'
import { TownHallBookComponent } from './townhall-book.component';
import { MaterialModule } from '../../../../../shared/modules/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '../../../../../shared/modules/translate/translate.module';
import { TitleBarComponent } from '../../../../../shared/components/title-bar/title-bar.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ControlMessagesComponent } from '../../../../../shared/components/control-messages/control-messages.component';
import { ValidationFieldsDirective } from '../../../../../shared/directives/validation-fields.directive';
import { AddressComponent } from '../../../../../shared/components/address/address.component';
import { GujInputTargetDirective } from '../../../../../shared/directives/guj-input-target.directive';
import { GujInputSourceDirective } from '../../../../../shared/directives/guj-input-source.directive';
import { CommonService } from '../../../../../shared/services/common.service';
import { SessionStorageService } from 'angular-web-storage';
import { BookingService } from '../../../../../core/services/citizen/data-services/booking.service';
import { HttpService } from '../../../../../shared/services/http.service';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { FormsActionsService } from '../../../../../core/services/citizen/data-services/forms-actions.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

fdescribe('TownHall Booking : TownHallListComponent', () => {
  let component: TownHallBookComponent;
  let fixture: ComponentFixture<TownHallBookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        RouterTestingModule,
        TranslateModule,
        NgSelectModule,
        ReactiveFormsModule,
        ToastrModule.forRoot({
          timeOut: 5000,
          positionClass: 'toast-top-right',
          preventDuplicates: true,
          progressBar: true,
          closeButton: true
        })],
      declarations: [
        TownHallBookComponent,
        AddressComponent,
        GujInputTargetDirective,
        GujInputSourceDirective,
        TitleBarComponent,
        ControlMessagesComponent,
        ValidationFieldsDirective],
      providers: [
        CommonService,
        SessionStorageService,
        BookingService,
        FormsActionsService,
        HttpService,
        ToastrService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TownHallBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("Should show insturtion page initally" , () => {
    expect(component.guideLineFlag).toBeTruthy();
  })

  it("Should show Townhall search form after submit of guide line", () => {
    component.guideLineFlag = false;
    component.showSearchForm = true;
    fixture.detectChanges();
  })
});
