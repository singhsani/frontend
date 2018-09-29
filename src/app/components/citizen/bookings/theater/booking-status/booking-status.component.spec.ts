import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";

import { BookingStatusComponent } from './booking-status.component';
import { TranslateModule } from '../../../../../shared/modules/translate/translate.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from '../../../../../shared/modules/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ControlMessagesComponent } from '../../../../../shared/components/control-messages/control-messages.component';
import { TitleBarComponent } from '../../../../../shared/components/title-bar/title-bar.component';
import { SessionStorageService } from 'angular-web-storage';
import { HttpService } from '../../../../../shared/services/http.service';

describe('Children Theater: BookingStatusComponent', () => {
  let component: BookingStatusComponent;
  let fixture: ComponentFixture<BookingStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule,
        BrowserAnimationsModule,
        RouterTestingModule,
        NgSelectModule,
        MaterialModule,
        ReactiveFormsModule,
        HttpClientTestingModule],
      declarations: [BookingStatusComponent,
        ControlMessagesComponent,
        TitleBarComponent],
        providers: [
          HttpService,
          SessionStorageService
        ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
