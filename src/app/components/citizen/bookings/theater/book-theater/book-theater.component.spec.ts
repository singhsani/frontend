import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookTheaterComponent } from './book-theater.component';
import { TranslateModule } from '../../../../../shared/modules/translate/translate.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from '../../../../../shared/modules/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TitleBarComponent } from '../../../../../shared/components/title-bar/title-bar.component';
import { HttpService } from '../../../../../shared/services/http.service';
import { SessionStorageService } from 'angular-web-storage';

describe('Children Theater: BookTheaterComponent', () => {
  let component: BookTheaterComponent;
  let fixture: ComponentFixture<BookTheaterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule,
        BrowserAnimationsModule,
        RouterTestingModule,
        NgSelectModule,
        MaterialModule,
        ReactiveFormsModule,
        HttpClientTestingModule],
      declarations: [BookTheaterComponent,
        TitleBarComponent],
      providers: [
        HttpService,
        SessionStorageService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookTheaterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
