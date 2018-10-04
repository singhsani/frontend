import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HosFileUploadComponent } from './hos-file-upload.component';
import { MaterialModule } from '../../modules/material/material.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HosUploadFileService } from '../../hos-upload-file.service';
import { CommonService } from '../../services/common.service';
import { SessionStorageService } from 'angular-web-storage';
import { HttpService } from '../../services/http.service';
import { FormArray, FormGroup } from '@angular/forms';

describe('Shared : HosFileUploadComponent', () => {
  let component: HosFileUploadComponent;
  let fixture: ComponentFixture<HosFileUploadComponent>;

  const createComponent = () => {
    fixture = TestBed.createComponent(HosFileUploadComponent);
    component = fixture.componentInstance;
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule, HttpClientTestingModule],
      declarations: [ HosFileUploadComponent ],
      providers: [HosUploadFileService,
        CommonService,
        SessionStorageService,
        HttpService]
    })
    .compileComponents().then(() => {
      createComponent();
      const attachment = new FormArray([])
      const form = new FormGroup({ attachments: attachment })
      component.form = form;
    });
  }));

  it('should create', () => {
    component.ngOnInit();
    expect(component.attachments.length).toBe(0);
  });
});
