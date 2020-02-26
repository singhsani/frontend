import { TestBed, async, inject } from '@angular/core/testing';

import { AuthGuard } from './auth.guard';
import { AppService } from '../services/citizen/app-services/app.service';
import { RouterTestingModule } from '@angular/router/testing';
import { SessionStorageService } from 'angular-web-storage';
import { HttpService } from '../../shared/services/http.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrService, ToastrModule } from 'ngx-toastr';

 describe('Core Guard : AuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, ToastrModule.forRoot(), HttpClientTestingModule],
      providers: [AuthGuard, 
        ToastrService,
        AppService,
         HttpService, 
        SessionStorageService]
    });
  });

  it('should ...', inject([AuthGuard], (guard: AuthGuard) => {
    expect(guard).toBeTruthy();
  }));
});
