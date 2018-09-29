import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TheaterListComponent } from './theater-list.component';
import { TranslateModule } from '../../../../../shared/modules/translate/translate.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from '../../../../../shared/modules/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { BookingService } from '../../../../../core/services/citizen/data-services/booking.service';
import { HttpService } from '../../../../../shared/services/http.service';
import { SessionStorageService } from 'angular-web-storage';
import { CommonService } from '../../../../../shared/services/common.service';
import { TitleBarComponent } from '../../../../../shared/components/title-bar/title-bar.component';
import { ControlMessagesComponent } from '../../../../../shared/components/control-messages/control-messages.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { GujInputSourceDirective } from '../../../../../shared/directives/guj-input-source.directive';
import { GujInputTargetDirective } from '../../../../../shared/directives/guj-input-target.directive';
import { ValidationFieldsDirective } from '../../../../../shared/directives/validation-fields.directive';

describe('Children Theater: TheaterListComponent', () => {
  let component: TheaterListComponent;
  let fixture: ComponentFixture<TheaterListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        NgSelectModule,
        RouterTestingModule,
        MaterialModule,
        ReactiveFormsModule,
        ToastrModule.forRoot()],
      providers: [BookingService,
        HttpService,
        SessionStorageService,
        CommonService,
        ToastrService],
      declarations: [ TheaterListComponent, 
        TitleBarComponent, 
        ControlMessagesComponent,
      GujInputSourceDirective,
    GujInputTargetDirective,
  ValidationFieldsDirective ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TheaterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
