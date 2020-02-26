import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HosActionBarComponent } from './hos-action-bar.component';
import { RouterTestingModule } from "@angular/router/testing";
import { TranslateModule } from '../../modules/translate/translate.module';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MaterialModule } from '../../modules/material/material.module';
import { SessionStorageService } from 'angular-web-storage';
import { CommonService } from '../../services/common.service';
import { HttpService } from '../../services/http.service';
import { HosFormActionsService } from '../../../core/services/hospital/data-services/hos-form-actions.service';


describe('Shared : HosActionBarComponent', () => {
  let component: HosActionBarComponent;
  let fixture: ComponentFixture<HosActionBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule,
        ToastrModule.forRoot(),
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        MaterialModule],
      declarations: [ HosActionBarComponent ],
      providers: [SessionStorageService,
        CommonService,
        HosFormActionsService,
        HttpService,
        ToastrService
      ]
    })
    .compileComponents().then(() => {
      fixture = TestBed.createComponent(HosActionBarComponent);
      component = fixture.componentInstance;
      //fixture.detectChanges();
    });
  }));

  it('should create', () => {
    const step: string = "step1";
    component.step = step;
    const apiType = new FormControl('apiType');
    const form = new FormGroup({ apiType: apiType });
    component.form = form;
    expect(component).toBeTruthy();
  });
});
