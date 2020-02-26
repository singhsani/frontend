import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopLicDuplicateComponent } from './shop-lic-duplicate.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '../../../../../shared/modules/translate/translate.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../../shared/modules/material/material.module';
import { RouterTestingModule } from '@angular/router/testing';
import { NgSelectModule } from '@ng-select/ng-select';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { HttpService } from '../../../../../shared/services/http.service';
import { ValidationService } from '../../../../../shared/services/validation.service';
import { FormsActionsService } from '../../../../../core/services/citizen/data-services/forms-actions.service';
import { SessionStorageService } from 'angular-web-storage';
import { CommonService } from '../../../../../shared/services/common.service';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { TitleBarComponent } from '../../../../../shared/components/title-bar/title-bar.component';
import { ControlMessagesComponent } from '../../../../../shared/components/control-messages/control-messages.component';
import { GujInputSourceDirective } from '../../../../../shared/directives/guj-input-source.directive';
import { GujInputTargetDirective } from '../../../../../shared/directives/guj-input-target.directive';
import { AddressComponent } from '../../../../../shared/components/address/address.component';
import { ActionBarComponent } from '../../../../../shared/components/action-bar/action-bar.component';
import { ShopAndEstablishmentService } from '../common/services/shop-and-establishment.service';

describe('ShopLicDuplicateComponent', () => {
  let component: ShopLicDuplicateComponent;
  let fixture: ComponentFixture<ShopLicDuplicateComponent>;
  let activatedRoute: MockActivatedRoute;

  beforeEach(() => {
    activatedRoute = new MockActivatedRoute();
  })
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ShopLicDuplicateComponent,
        TitleBarComponent,
        ControlMessagesComponent,
        GujInputSourceDirective,
        GujInputTargetDirective,
        AddressComponent,
        ActionBarComponent
      ],
      imports: [
        BrowserAnimationsModule,
        TranslateModule,
        FormsModule,
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
        HttpService,
        ValidationService,
        FormsActionsService,
        SessionStorageService,
        CommonService,
        ShopAndEstablishmentService,
        { provide: ActivatedRoute, useValue: activatedRoute }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopLicDuplicateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('should create', () => {
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