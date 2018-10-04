import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { Location } from "@angular/common";

import { PaymentResponsePageComponent } from './payment-response-page.component';
import { MaterialModule } from '../../modules/material/material.module';
import { FormsActionsService } from '../../../core/services/citizen/data-services/forms-actions.service';
import { SessionStorageService } from 'angular-web-storage';
import { HttpService } from '../../services/http.service';
import { Router } from '@angular/router';
import { routes } from '../../../app-routing.module';
import { PageNotFoundComponent } from '../../../page-not-found/page-not-found.component';
import { AppModule } from '../../../app.module';
describe('Shared : PaymentResponsePageComponent', () => {
  let component: PaymentResponsePageComponent;
  let fixture: ComponentFixture<PaymentResponsePageComponent>;
  let location: Location;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule,
        HttpClientTestingModule, RouterTestingModule.withRoutes(routes)],
      providers: [
        FormsActionsService,
        HttpService,
        SessionStorageService],
      declarations: [PaymentResponsePageComponent, PageNotFoundComponent],

    })
      .compileComponents().then(() => {
        fixture = TestBed.createComponent(PaymentResponsePageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  }));

  it('should create', ()=> {
    expect(component).toBeTruthy();
  });
});
