import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopLicNewComponent } from './shop-lic-new.component';
import { TitleBarComponent } from '../../../../../shared/components/title-bar/title-bar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ControlMessagesComponent } from '../../../../../shared/components/control-messages/control-messages.component';
import { MaterialModule } from '../../../../../shared/modules/material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '../../../../../shared/modules/translate/translate.module';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { GujInputSourceDirective } from '../../../../../shared/directives/guj-input-source.directive';
import { GujInputTargetDirective } from '../../../../../shared/directives/guj-input-target.directive';
import { NgSelectModule } from '@ng-select/ng-select';
import { AddressComponent } from '../../../../../shared/components/address/address.component';
import { ActionBarComponent } from '../../../../../shared/components/action-bar/action-bar.component';
import { ValidationFieldsDirective } from '../../../../../shared/directives/validation-fields.directive';
import { FileUploadComponent } from '../../../../../shared/components/file-upload/file-upload.component';
import { FilterAttachmentPipe } from '../common/pipes/filter-attachment.pipe';
import { ValidationService } from '../../../../../shared/services/validation.service';
import { FormsActionsService } from '../../../../../core/services/citizen/data-services/forms-actions.service';
import { SessionStorageService } from 'angular-web-storage';
import { HttpService } from '../../../../../shared/services/http.service';
import { CommonService } from '../../../../../shared/services/common.service';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ShopAndEstablishmentService } from '../common/services/shop-and-establishment.service';

describe('ShopLicNewComponent', () => {
  let component: ShopLicNewComponent;
  let fixture: ComponentFixture<ShopLicNewComponent>;
  let activatedRoute: MockActivatedRoute;

  beforeEach(() => {
    activatedRoute = new MockActivatedRoute();
  })

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ShopLicNewComponent,
        TitleBarComponent,
        ControlMessagesComponent,
        GujInputSourceDirective,
        GujInputTargetDirective,
        AddressComponent,
        ActionBarComponent,
        ValidationFieldsDirective,
        FileUploadComponent,
        FilterAttachmentPipe
      ],
      imports: [
        BrowserAnimationsModule,
        TranslateModule,
        ReactiveFormsModule,
        MaterialModule,
        RouterTestingModule,
        NgSelectModule,
        HttpClientTestingModule,
        ToastrModule.forRoot({
          timeOut: 5000,
          positionClass: 'toast-top-right',
          preventDuplicates: true,
          progressBar: true,
          closeButton: true
        })
      ],
      providers: [
        CommonService,
        ValidationService,
        FormsActionsService,
        SessionStorageService,
        HttpService,
        ShopAndEstablishmentService,
        { provide: ActivatedRoute, useValue: activatedRoute }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopLicNewComponent);
    component = fixture.componentInstance;
    activatedRoute.testParams = convertToParamMap({ id: 10, apiCode: "HEL-DUPMR" })
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


export class MockActivatedRoute {
  private paramsSubject = new BehaviorSubject(this.testParams);
  private _testParams: {};

  paramMap = this.paramsSubject.asObservable();

  get testParams() {
    return this._testParams;
  }

  set testParams(newParams) {
    this._testParams = newParams;
    this.paramsSubject.next(newParams);
  }
}