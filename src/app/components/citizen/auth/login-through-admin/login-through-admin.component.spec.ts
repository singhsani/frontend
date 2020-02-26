import {
  inject,
  tick,
  TestBed,
  getTestBed,
  async,
  fakeAsync,
  ComponentFixture
} from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs/Rx';



import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { AppService } from '../../../../core/services/citizen/app-services/app.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from "@angular/router/testing";


import { LoginThroughAdminComponent } from './login-through-admin.component';
import { SessionStorageService } from 'angular-web-storage';
import { FormsActionsService } from '../../../../core/services/citizen/data-services/forms-actions.service';
import { HosAppService } from '../../../../core/services/hospital/app-services/hos-app.service';
import { Observable, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';


describe('LoginThroughAdminComponent', () => {

  const createComponent = () => {
    fixture = TestBed.createComponent(LoginThroughAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  let component: LoginThroughAdminComponent;
  let fixture: ComponentFixture<LoginThroughAdminComponent>;
  let activeRoute: MockActivatedRoute;
  let session: SessionStorageService;
  let service : FormsActionsService;

  beforeEach(() => {
    activeRoute = new MockActivatedRoute();
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule, 
        ReactiveFormsModule, 
        SharedModule, 
        RouterTestingModule, 
        BrowserAnimationsModule],
      declarations: [LoginThroughAdminComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activeRoute },
        SessionStorageService,
        FormsActionsService,
        HosAppService,
        AppService]
    })
      .compileComponents();
  }));

  afterAll(() => {
    component = null;
  })

  afterEach(() => {
    activeRoute.testParams = { authToken: null, apiCode: null };
    session = new SessionStorageService();
    session.remove('access_token');
    session.remove('fromAdmin');
  })

  it('should create LoginThroughAdminComponent', () => {
    createComponent();
    expect(component).toBeDefined();
  });

  it('Should show alert if auth token is not available', () => {
    activeRoute.testParams = { authToken: null, apiCode: null };
    createComponent();
    expect(component.commonService.openAlert).toBeTruthy();
  });

});


/**
 * 
 * Mocking Activated Route with MockActivatedRoute Class do we can get route params.
 */

export class MockActivatedRoute {
  private paramsSubject = new BehaviorSubject(this.testParams);
  private _testParams: {};

  paramMap = this.paramsSubject.asObservable();

  get testParams() {
    return this._testParams;
  }

  set testParams(newParams: any) {
    this._testParams = newParams;
    this.paramsSubject.next(newParams);
  }
}
