import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule} from '@angular/common/http/testing'
import { BasicDetailsComponent } from './basic-details.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../modules/material/material.module';
import { ControlMessagesComponent } from '../control-messages/control-messages.component';
import { TranslateModule } from '../../modules/translate/translate.module';
import { ValidationFieldsDirective } from '../../directives/validation-fields.directive';
import { SessionStorageService } from 'angular-web-storage';
import { HttpService } from '../../services/http.service';

describe('Shared : BasicDetailsComponent', () => {
  let component: BasicDetailsComponent;
  let fixture: ComponentFixture<BasicDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule,
        HttpClientTestingModule,
        TranslateModule,
        MaterialModule],
      declarations: [BasicDetailsComponent,
        ControlMessagesComponent,
        ValidationFieldsDirective],
      providers: [SessionStorageService, HttpService]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(BasicDetailsComponent);
      component = fixture.componentInstance;
    });
  }));

  beforeEach(() => {
    //fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
