import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule} from '@angular/router/testing'
import { HttpClientTestingModule } from "@angular/common/http/testing";

import { HospitalRegisterComponent } from './hospital-register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../shared/modules/material/material.module';
import { ControlMessagesComponent } from '../../../../shared/components/control-messages/control-messages.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { HosAppService } from '../../../../core/services/hospital/app-services/hos-app.service';
import { SessionStorageService } from 'angular-web-storage';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('Hospital Module : HospitalRegisterComponent', () => {
  let component: HospitalRegisterComponent;
  let fixture: ComponentFixture<HospitalRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MaterialModule,
        NgSelectModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot(),
        HttpClientTestingModule
      ],
      declarations: [HospitalRegisterComponent,
        ControlMessagesComponent],
      providers: [HosAppService,
        SessionStorageService,
        ToastrService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
